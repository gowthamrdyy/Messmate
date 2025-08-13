/**
 * FCM Token Utility for Messmate
 * Run this in browser console to get FCM token
 */

import pushNotificationService from '../services/pushNotificationService.js';
import freePushNotificationService from '../services/freePushNotificationService.js';

/**
 * Get FCM token from console
 * Usage: await getFCMToken()
 */
export const getFCMToken = async () => {
  try {
    console.log('🔑 Getting FCM token...');
    
    // Initialize the service
    await pushNotificationService.initialize();
    
    // Request permission
    const permissionResult = await pushNotificationService.requestPermission();
    console.log('Permission result:', permissionResult);
    
    if (!permissionResult.success && permissionResult.permission !== 'granted') {
      throw new Error('Notification permission denied');
    }
    
    // Subscribe to get the token
    const subscribeResult = await pushNotificationService.subscribe();
    console.log('Subscribe result:', subscribeResult);
    
    if (subscribeResult.success && subscribeResult.subscription) {
      // Extract token from subscription
      const subscriptionData = subscribeResult.subscription.toJSON();
      const token = subscriptionData.endpoint || 'Local notification subscription';
      console.log('✅ FCM Token obtained:', token);
      return token;
    } else if (subscribeResult.token) {
      // Firebase token
      console.log('✅ Firebase FCM Token obtained:', subscribeResult.token);
      return subscribeResult.token;
    } else {
      throw new Error('Failed to get subscription token');
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    throw error;
  }
};

/**
 * Get current token without subscribing
 * Usage: getCurrentToken()
 */
export const getCurrentToken = () => {
  try {
    const status = pushNotificationService.getSubscriptionStatus();
    
    if (status.isSubscribed) {
      if (status.hasToken) {
        // Try to get from free service
        const freeToken = freePushNotificationService.getCurrentToken();
        if (freeToken) {
          console.log('✅ Current FCM Token:', freeToken);
          return freeToken;
        }
      }
      
      console.log('✅ User is subscribed but no token available');
      return 'Subscribed (token not available)';
    } else {
      console.log('❌ User is not subscribed');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting current token:', error);
    return null;
  }
};

/**
 * Copy FCM token to clipboard
 * Usage: await copyFCMToken()
 */
export const copyFCMToken = async () => {
  try {
    const token = await getFCMToken();
    
    if (token && token !== 'Local notification subscription') {
      await navigator.clipboard.writeText(token);
      console.log('✅ FCM Token copied to clipboard!');
      return true;
    } else {
      console.log('⚠️ No valid token to copy');
      return false;
    }
  } catch (error) {
    console.error('❌ Error copying FCM token:', error);
    return false;
  }
};

/**
 * Display FCM token info
 * Usage: showFCMTokenInfo()
 */
export const showFCMTokenInfo = () => {
  const status = pushNotificationService.getSubscriptionStatus();
  
  console.log('🔑 FCM Token Information:');
  console.log('========================');
  console.log('Supported:', status.isSupported ? '✅' : '❌');
  console.log('Subscribed:', status.isSubscribed ? '✅' : '❌');
  console.log('Permission:', status.permission);
  console.log('Has Token:', status.hasToken ? '✅' : '❌');
  console.log('Service:', status.isSubscribed ? '🆓 FREE' : 'None');
  
  if (status.isSubscribed) {
    const token = getCurrentToken();
    if (token) {
      console.log('Current Token:', token);
    }
  }
  
  console.log('========================');
  console.log('Commands:');
  console.log('- await getFCMToken() - Get new FCM token');
  console.log('- getCurrentToken() - Get current token');
  console.log('- await copyFCMToken() - Copy token to clipboard');
};

// Auto-run info when imported
if (typeof window !== 'undefined') {
  console.log('🔑 FCM Token utilities loaded!');
  console.log('Run showFCMTokenInfo() to see available commands');
  
  // Make functions globally available
  window.getFCMToken = getFCMToken;
  window.getCurrentToken = getCurrentToken;
  window.copyFCMToken = copyFCMToken;
  window.showFCMTokenInfo = showFCMTokenInfo;
}

export default {
  getFCMToken,
  getCurrentToken,
  copyFCMToken,
  showFCMTokenInfo
};
