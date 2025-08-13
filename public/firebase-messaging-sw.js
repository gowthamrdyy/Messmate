/**
 * Firebase Messaging Service Worker for Messmate
 * Handles background push notifications
 */

// Import Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('📨 Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'Messmate';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/pwa-192x192.png',
    badge: '/Messmate.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    tag: payload.data?.type || 'default',
    data: payload.data || {},
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
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event);

  event.notification.close();

  // Handle action clicks
  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('🔔 Notification closed:', event);
});

// Handle push event (fallback for older browsers)
self.addEventListener('push', (event) => {
  console.log('📨 Push event received:', event);

  if (event.data) {
    try {
      const payload = event.data.json();
      const notificationTitle = payload.notification?.title || 'Messmate';
      const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/pwa-192x192.png',
        badge: '/Messmate.png',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        tag: payload.data?.type || 'default',
        data: payload.data || {},
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
      };

      event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
      );
    } catch (error) {
      console.error('❌ Error parsing push data:', error);
      
      // Fallback notification
      const notificationTitle = 'Messmate';
      const notificationOptions = {
        body: 'You have a new notification',
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
      };

      event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
      );
    }
  }
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('🔧 Firebase messaging service worker installed');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('🔧 Firebase messaging service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle service worker message events
self.addEventListener('message', (event) => {
  console.log('📨 Service worker message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
