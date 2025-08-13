/**
 * FCM Token Display Component for Messmate
 * Shows and allows copying of FCM tokens
 */

import React, { useState, useEffect } from 'react';
import freePushNotificationService from '../../services/freePushNotificationService.js';
import pushNotificationService from '../../services/pushNotificationService.js';

const FCMTokenDisplay = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    // Get initial subscription status
    updateSubscriptionStatus();
  }, []);

  const updateSubscriptionStatus = () => {
    const status = pushNotificationService.getSubscriptionStatus();
    setSubscriptionStatus(status);
  };

  const getFCMToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Initialize the service if not already done
      await pushNotificationService.initialize();
      
      // Request permission
      const permissionResult = await pushNotificationService.requestPermission();
      
      if (!permissionResult.success && permissionResult.permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
      
      // Subscribe to get the token
      const subscribeResult = await pushNotificationService.subscribe();
      
      if (subscribeResult.success && subscribeResult.subscription) {
        // Extract token from subscription
        const subscriptionData = subscribeResult.subscription.toJSON();
        setToken(subscriptionData.endpoint || 'Local notification subscription');
        updateSubscriptionStatus();
      } else if (subscribeResult.token) {
        // Firebase token
        setToken(subscribeResult.token);
        updateSubscriptionStatus();
      } else {
        throw new Error('Failed to get subscription token');
      }
    } catch (err) {
      console.error('Error getting FCM token:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = async () => {
    if (!token) return;
    
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = token;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearToken = () => {
    setToken(null);
    setError(null);
    setCopied(false);
  };

  const getTokenType = () => {
    if (!token) return 'No token';
    if (token.includes('fcm.googleapis.com')) return 'Firebase FCM Token';
    if (token.includes('endpoint')) return 'Web Push Subscription';
    if (token === 'Local notification subscription') return 'Local Notification';
    return 'Push Subscription';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🔑 FCM Token Display
      </h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Service:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            subscriptionStatus?.isSubscribed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {subscriptionStatus?.isSubscribed ? '🆓 FREE Service Active' : 'Not Subscribed'}
          </span>
        </div>
        
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Permission:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            subscriptionStatus?.permission === 'granted' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {subscriptionStatus?.permission || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {!token && !loading && (
          <button
            onClick={getFCMToken}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            🔑 Get FCM Token
          </button>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Getting FCM token...</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {token && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Token Type:</span>
              <span className="text-sm text-gray-600">{getTokenType()}</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FCM Token / Subscription:
              </label>
              <div className="relative">
                <textarea
                  value={token}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                  rows="4"
                  style={{ wordBreak: 'break-all' }}
                />
                <button
                  onClick={copyToken}
                  className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={getFCMToken}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                🔄 Refresh Token
              </button>
              <button
                onClick={clearToken}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p className="font-medium mb-1">Debug Info:</p>
        <p>Supported: {subscriptionStatus?.isSupported ? '✅' : '❌'}</p>
        <p>Subscribed: {subscriptionStatus?.isSubscribed ? '✅' : '❌'}</p>
        <p>Has Token: {subscriptionStatus?.hasToken ? '✅' : '❌'}</p>
        <p>Permission: {subscriptionStatus?.permission || 'Unknown'}</p>
        <p>Service: {subscriptionStatus?.isSubscribed ? '🆓 FREE' : 'None'}</p>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
        <p className="font-medium mb-1">💡 How to use this token:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Copy the token above</li>
          <li>Use it in your server to send push notifications</li>
          <li>For free service: Use with web-push library</li>
          <li>For Firebase: Use with Firebase Admin SDK</li>
          <li>Token is unique per user and device</li>
        </ul>
      </div>
    </div>
  );
};

export default FCMTokenDisplay;
