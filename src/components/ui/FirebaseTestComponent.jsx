/**
 * Firebase Test Component for Messmate
 * Allows testing Firebase push notifications
 */

import React, { useState, useEffect } from 'react';
import firebaseNotificationService from '../../services/firebaseNotificationService.js';
import freePushNotificationService from '../../services/freePushNotificationService.js';
import pushNotificationService from '../../services/pushNotificationService.js';

const FirebaseTestComponent = () => {
  const [status, setStatus] = useState('idle');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [testMessage, setTestMessage] = useState('Test notification from Messmate!');
  const [isFirebaseEnabled, setIsFirebaseEnabled] = useState(false);
  const [isFreeServiceEnabled, setIsFreeServiceEnabled] = useState(true);

  useEffect(() => {
    // Check if Firebase is enabled
    const config = import.meta.env.VITE_USE_FIREBASE;
    setIsFirebaseEnabled(config === 'true');
    setIsFreeServiceEnabled(!isFirebaseEnabled);
    
    // Get initial subscription status
    updateSubscriptionStatus();
  }, []);

  const updateSubscriptionStatus = () => {
    const status = pushNotificationService.getSubscriptionStatus();
    setSubscriptionStatus(status);
  };

  const initializeNotifications = async () => {
    setStatus('initializing');
    try {
      const success = await pushNotificationService.initialize();
      if (success) {
        setStatus('initialized');
        updateSubscriptionStatus();
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      setStatus('failed');
    }
  };

  const requestPermission = async () => {
    setStatus('requesting');
    try {
      const result = await pushNotificationService.requestPermission();
      if (result.success || result.permission === 'granted') {
        setStatus('permission-granted');
        updateSubscriptionStatus();
      } else {
        setStatus('permission-denied');
      }
    } catch (error) {
      console.error('Failed to request permission:', error);
      setStatus('failed');
    }
  };

  const subscribe = async () => {
    setStatus('subscribing');
    try {
      const result = await pushNotificationService.subscribe();
      if (result.success || result.token) {
        setStatus('subscribed');
        updateSubscriptionStatus();
      } else {
        setStatus('subscription-failed');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setStatus('failed');
    }
  };

  const unsubscribe = async () => {
    setStatus('unsubscribing');
    try {
      const success = await pushNotificationService.unsubscribe();
      if (success) {
        setStatus('unsubscribed');
        updateSubscriptionStatus();
      } else {
        setStatus('unsubscribe-failed');
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      setStatus('failed');
    }
  };

  const sendTestNotification = async () => {
    setStatus('sending');
    try {
      if (isFirebaseEnabled) {
        // For Firebase, we'll send a local notification as a test
        await firebaseNotificationService.sendLocalNotification(
          'Test Notification',
          {
            body: testMessage,
            icon: '/pwa-192x192.png',
            badge: '/Messmate.png',
            vibrate: [200, 100, 200],
            requireInteraction: false,
            actions: [
              {
                action: 'view',
                title: 'View',
                icon: '/Messmate.png'
              },
              {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/Messmate.png'
              }
            ]
          }
        );
      } else {
        // For free service
        await freePushNotificationService.sendLocalNotification(
          'Test Notification',
          {
            body: testMessage,
            icon: '/pwa-192x192.png',
            badge: '/Messmate.png',
            vibrate: [200, 100, 200],
            requireInteraction: false,
            actions: [
              {
                action: 'view',
                title: 'View',
                icon: '/Messmate.png'
              },
              {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/Messmate.png'
              }
            ]
          }
        );
      }
      setStatus('sent');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setStatus('failed');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'idle': return 'text-gray-500';
      case 'initializing': return 'text-blue-500';
      case 'initialized': return 'text-green-500';
      case 'requesting': return 'text-blue-500';
      case 'permission-granted': return 'text-green-500';
      case 'permission-denied': return 'text-red-500';
      case 'subscribing': return 'text-blue-500';
      case 'subscribed': return 'text-green-500';
      case 'subscription-failed': return 'text-red-500';
      case 'unsubscribing': return 'text-blue-500';
      case 'unsubscribed': return 'text-yellow-500';
      case 'unsubscribe-failed': return 'text-red-500';
      case 'sending': return 'text-blue-500';
      case 'sent': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'idle': return 'Ready to test';
      case 'initializing': return 'Initializing...';
      case 'initialized': return 'Initialized';
      case 'requesting': return 'Requesting permission...';
      case 'permission-granted': return 'Permission granted';
      case 'permission-denied': return 'Permission denied';
      case 'subscribing': return 'Subscribing...';
      case 'subscribed': return 'Subscribed';
      case 'subscription-failed': return 'Subscription failed';
      case 'unsubscribing': return 'Unsubscribing...';
      case 'unsubscribed': return 'Unsubscribed';
      case 'unsubscribe-failed': return 'Unsubscribe failed';
      case 'sending': return 'Sending notification...';
      case 'sent': return 'Notification sent';
      case 'failed': return 'Failed';
      default: return 'Unknown status';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🔔 Push Notification Test
      </h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Provider:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            isFirebaseEnabled 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isFirebaseEnabled ? 'Firebase Cloud Messaging' : '🆓 FREE Service'}
          </span>
        </div>
        
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {subscriptionStatus && (
          <div className="text-xs text-gray-600 space-y-1">
            <div>Supported: {subscriptionStatus.isSupported ? '✅' : '❌'}</div>
            <div>Subscribed: {subscriptionStatus.isSubscribed ? '✅' : '❌'}</div>
            <div>Permission: {subscriptionStatus.permission}</div>
            {isFirebaseEnabled && (
              <div>Has Token: {subscriptionStatus.hasToken ? '✅' : '❌'}</div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={initializeNotifications}
          disabled={status === 'initializing'}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Initialize Notifications
        </button>

        <button
          onClick={requestPermission}
          disabled={status === 'requesting' || status === 'permission-denied'}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Permission
        </button>

        <button
          onClick={subscribe}
          disabled={status === 'subscribing' || !subscriptionStatus?.isSupported}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Subscribe to Notifications
        </button>

        <button
          onClick={unsubscribe}
          disabled={status === 'unsubscribing' || !subscriptionStatus?.isSubscribed}
          className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Unsubscribe from Notifications
        </button>

        <div className="border-t pt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Message:
          </label>
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Enter test message..."
          />
          
          <button
            onClick={sendTestNotification}
            disabled={status === 'sending' || !subscriptionStatus?.isSubscribed}
            className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Test Notification
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p className="font-medium mb-1">Debug Info:</p>
        <p>Firebase Enabled: {isFirebaseEnabled ? 'Yes' : 'No'}</p>
        <p>Free Service Enabled: {isFreeServiceEnabled ? 'Yes' : 'No'}</p>
        <p>Service Worker: {'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}</p>
        <p>Push Manager: {'PushManager' in window ? 'Supported' : 'Not Supported'}</p>
        <p>Notifications: {'Notification' in window ? 'Supported' : 'Not Supported'}</p>
        <p>Cost: {isFirebaseEnabled ? '$25+/month' : '$0/month'}</p>
      </div>
    </div>
  );
};

export default FirebaseTestComponent;
