/**
 * Firebase Notification Service for Messmate
 * Handles Firebase Cloud Messaging for push notifications
 */

import { 
  messaging, 
  vapidKey, 
  requestNotificationPermission, 
  onForegroundMessage, 
  getCurrentToken, 
  deleteToken 
} from '../config/firebase.js';

class FirebaseNotificationService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window && !!messaging;
    this.messaging = messaging;
    this.token = null;
    this.foregroundUnsubscribe = null;
    
    // Initialize foreground message handler
    this.initializeForegroundHandler();
  }

  /**
   * Initialize foreground message handler
   */
  initializeForegroundHandler() {
    if (this.isSupported) {
      this.foregroundUnsubscribe = onForegroundMessage((payload) => {
        this.handleForegroundMessage(payload);
      });
    }
  }

  /**
   * Handle foreground messages
   */
  handleForegroundMessage(payload) {
    console.log('📨 Foreground message received:', payload);
    
    // You can add custom logic here to handle different message types
    if (payload.data) {
      const { type, mealName, menuItems } = payload.data;
      
      switch (type) {
        case 'meal_reminder':
          this.showMealReminderNotification(payload.notification, menuItems);
          break;
        case 'menu_update':
          this.showMenuUpdateNotification(payload.notification, menuItems);
          break;
        case 'special_meal':
          this.showSpecialMealNotification(payload.notification, menuItems);
          break;
        default:
          this.showDefaultNotification(payload.notification);
      }
    } else {
      this.showDefaultNotification(payload.notification);
    }
  }

  /**
   * Show meal reminder notification
   */
  showMealReminderNotification(notification, menuItems = []) {
    const { title, body } = notification;
    
    const notificationInstance = new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/Messmate.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      tag: 'meal-reminder',
      data: { menuItems },
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

    this.setupNotificationClickHandler(notificationInstance);
  }

  /**
   * Show menu update notification
   */
  showMenuUpdateNotification(notification, menuItems = []) {
    const { title, body } = notification;
    
    const notificationInstance = new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/Messmate.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      tag: 'menu-update',
      data: { menuItems },
      actions: [
        {
          action: 'view',
          title: 'View Changes',
          icon: '/Messmate.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/Messmate.png'
        }
      ]
    });

    this.setupNotificationClickHandler(notificationInstance);
  }

  /**
   * Show special meal notification
   */
  showSpecialMealNotification(notification, menuItems = []) {
    const { title, body } = notification;
    
    const notificationInstance = new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/Messmate.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      tag: 'special-meal',
      data: { menuItems },
      actions: [
        {
          action: 'view',
          title: 'View Special Menu',
          icon: '/Messmate.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/Messmate.png'
        }
      ]
    });

    this.setupNotificationClickHandler(notificationInstance);
  }

  /**
   * Show default notification
   */
  showDefaultNotification(notification) {
    const { title, body } = notification;
    
    const notificationInstance = new Notification(title, {
      body,
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
    });

    this.setupNotificationClickHandler(notificationInstance);
  }

  /**
   * Setup notification click handler
   */
  setupNotificationClickHandler(notification) {
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      
      // Handle action clicks
      if (event.action === 'view') {
        // Navigate to appropriate page based on notification type
        const tag = notification.tag;
        if (tag === 'meal-reminder' || tag === 'menu-update' || tag === 'special-meal') {
          window.location.href = '/';
        } else {
          window.location.href = '/';
        }
      }
    };
  }

  /**
   * Initialize Firebase notification service
   */
  async initialize() {
    if (!this.isSupported) {
      console.warn('Firebase notifications are not supported in this browser');
      return false;
    }

    try {
      console.log('🚀 Initializing Firebase notification service...');
      return true;
    } catch (error) {
      console.error('Failed to initialize Firebase notifications:', error);
      return false;
    }
  }

  /**
   * Request notification permission and get FCM token
   */
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Firebase notifications are not supported');
    }

    try {
      const result = await requestNotificationPermission();
      
      if (result.permission === 'granted' && result.token) {
        this.token = result.token;
        console.log('✅ Firebase notification permission granted and token obtained');
        return { success: true, token: this.token };
      } else {
        console.log('❌ Firebase notification permission denied or token not available');
        return { success: false, token: null };
      }
    } catch (error) {
      console.error('❌ Error requesting Firebase notification permission:', error);
      throw error;
    }
  }

  /**
   * Subscribe to notifications
   */
  async subscribe() {
    if (!this.isSupported) {
      throw new Error('Firebase notifications not initialized');
    }

    try {
      // Request permission and get token
      const result = await this.requestPermission();
      
      if (result.success && result.token) {
        // Send token to your server
        await this.sendTokenToServer(result.token);
        console.log('✅ Successfully subscribed to Firebase notifications');
        return result;
      } else {
        throw new Error('Failed to get notification permission or token');
      }
    } catch (error) {
      console.error('❌ Failed to subscribe to Firebase notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from notifications
   */
  async unsubscribe() {
    if (!this.token) {
      return false;
    }

    try {
      // Remove token from server
      await this.removeTokenFromServer(this.token);
      
      // Delete token from Firebase
      await deleteToken();
      
      this.token = null;
      console.log('✅ Successfully unsubscribed from Firebase notifications');
      return true;
    } catch (error) {
      console.error('❌ Failed to unsubscribe from Firebase notifications:', error);
      return false;
    }
  }

  /**
   * Send token to server
   */
  async sendTokenToServer(token) {
    try {
      const response = await fetch('/api/notifications/firebase/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Token sent to server successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to send token to server:', error);
      throw error;
    }
  }

  /**
   * Remove token from server
   */
  async removeTokenFromServer(token) {
    try {
      const response = await fetch('/api/notifications/firebase/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Token removed from server successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to remove token from server:', error);
      throw error;
    }
  }

  /**
   * Get current token
   */
  async getCurrentToken() {
    if (!this.token) {
      this.token = await getCurrentToken();
    }
    return this.token;
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences) {
    try {
      const token = await this.getCurrentToken();
      
      if (!token) {
        throw new Error('No FCM token available');
      }

      const response = await fetch('/api/notifications/firebase/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          preferences
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      console.log('✅ Notification preferences updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to update notification preferences:', error);
      return false;
    }
  }

  /**
   * Get subscription status
   */
  getSubscriptionStatus() {
    return {
      isSupported: this.isSupported,
      isSubscribed: !!this.token,
      permission: Notification.permission,
      hasToken: !!this.token
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.foregroundUnsubscribe) {
      this.foregroundUnsubscribe();
      this.foregroundUnsubscribe = null;
    }
  }
}

// Create singleton instance
const firebaseNotificationService = new FirebaseNotificationService();

export default firebaseNotificationService;
