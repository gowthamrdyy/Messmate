/**
 * Firebase Configuration for Messmate
 * Handles Firebase app initialization and configuration
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging = null;

// Check if messaging is supported
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase Messaging not available:', error);
  }
}

// VAPID key for web push notifications
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY_HERE';

export { app, messaging, vapidKey };

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async () => {
  if (!messaging) {
    throw new Error('Firebase Messaging not available');
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      
      // Get FCM token
      const token = await getToken(messaging, { vapidKey });
      
      if (token) {
        console.log('✅ FCM Token obtained:', token);
        return { permission: 'granted', token };
      } else {
        console.warn('⚠️ No FCM token available');
        return { permission: 'granted', token: null };
      }
    } else {
      console.log('❌ Notification permission denied');
      return { permission: 'denied', token: null };
    }
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    throw error;
  }
};

/**
 * Handle foreground messages
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.warn('⚠️ Firebase Messaging not available for foreground messages');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('📨 Foreground message received:', payload);
    
    if (callback) {
      callback(payload);
    }
    
    // Show notification even in foreground
    if (payload.notification) {
      const { title, body, icon } = payload.notification;
      new Notification(title, {
        body,
        icon: icon || '/pwa-192x192.png',
        badge: '/Messmate.png',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        actions: [
          {
            action: 'view',
            title: 'View Menu',
            icon: '/Messmate.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/Messmate.png'
          }
        ]
      });
    }
  });
};

/**
 * Get current FCM token
 */
export const getCurrentToken = async () => {
  if (!messaging) {
    return null;
  }

  try {
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
};

/**
 * Delete FCM token
 */
export const deleteToken = async () => {
  if (!messaging) {
    return false;
  }

  try {
    await messaging.deleteToken();
    console.log('✅ FCM token deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting FCM token:', error);
    return false;
  }
};

export default {
  app,
  messaging,
  vapidKey,
  requestNotificationPermission,
  onForegroundMessage,
  getCurrentToken,
  deleteToken
};
