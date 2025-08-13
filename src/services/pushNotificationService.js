/**
 * Push Notification Service for Messmate
 * Handles push notification registration, sending, and management
 * Now supports both Firebase Cloud Messaging and traditional web push
 */

import getNotificationConfig, { validateVAPIDConfig, validateAPIConfig } from '../config/notification.js';
import MockPushAPI from '../utils/mockPushAPI.js';
import firebaseNotificationService from './firebaseNotificationService.js';
import freePushNotificationService from './freePushNotificationService.js';

class PushNotificationService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.registration = null;
    this.subscription = null;
    
    // Load configuration
    this.config = getNotificationConfig();
    this.vapidPublicKey = this.config.publicKey;
    this.serverUrl = this.config.baseUrl;
    
    // Initialize API client
    this.apiClient = this.config.useMockAPI ? new MockPushAPI() : null;
    
    // Check if Firebase should be used (default to free service)
    this.useFirebase = this.config.useFirebase || false;
    this.useFreeService = !this.useFirebase; // Use free service by default
    
    // Validate configuration
    this.validateConfiguration();
  }

  /**
   * Validate configuration and log warnings
   */
  validateConfiguration() {
    if (this.config.skipVAPID) {
      console.log('🔧 Development mode: VAPID keys skipped for local testing');
    } else {
      validateVAPIDConfig();
    }
    
    if (this.config.useMockAPI) {
      console.log('🔧 Development mode: Using mock API for testing');
    } else {
      validateAPIConfig();
    }
  }

  /**
   * Initialize push notification service
   */
  async initialize() {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      if (this.useFirebase) {
        // Use Firebase Cloud Messaging
        console.log('🚀 Initializing Firebase push notifications...');
        const success = await firebaseNotificationService.initialize();
        if (success) {
          console.log('✅ Firebase push notifications initialized successfully');
        }
        return success;
      } else {
        // Use free push notification service
        console.log('🚀 Initializing FREE push notifications...');
        const success = await freePushNotificationService.initialize();
        if (success) {
          console.log('✅ Free push notifications initialized successfully');
        }
        return success;
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    if (this.useFirebase) {
      // Use Firebase notification permission
      return await firebaseNotificationService.requestPermission();
    } else {
      // Use free notification permission
      return await freePushNotificationService.requestPermission();
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe() {
    if (!this.isSupported) {
      throw new Error('Push notifications not initialized');
    }

    try {
      if (this.useFirebase) {
        // Use Firebase Cloud Messaging
        console.log('🔧 Using Firebase Cloud Messaging for push notifications');
        return await firebaseNotificationService.subscribe();
      } else {
        // Use free push notification service
        console.log('🔧 Using FREE push notification service');
        return await freePushNotificationService.subscribe();
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe() {
    try {
      if (this.useFirebase) {
        // Use Firebase Cloud Messaging
        return await firebaseNotificationService.unsubscribe();
      } else {
        // Use free push notification service
        return await freePushNotificationService.unsubscribe();
      }
    } catch (error) {
      console.error('❌ Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  /**
   * Send request to server API
   */
  async sendToServer(endpoint, data) {
    try {
      const url = `${this.serverUrl}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Send subscription to server
   */
  async sendSubscriptionToServer(subscription) {
    try {
      const subscriptionData = {
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };

      // Use configured API client (mock or real)
      if (this.config.useMockAPI) {
        const result = await this.apiClient.subscribe(subscriptionData);
        console.log('✅ Subscription sent to mock API successfully');
        return result;
      } else {
        // Send to real API
        const result = await this.sendToServer(this.config.endpoints.subscribe, subscriptionData);
        console.log('✅ Subscription sent to server successfully');
        return result;
      }
    } catch (error) {
      console.error('❌ Failed to send subscription to server:', error);
      throw error;
    }
  }

  /**
   * Remove subscription from server
   */
  async removeSubscriptionFromServer(subscription) {
    try {
      const subscriptionData = {
        subscription: subscription.toJSON(),
      };

      // Use configured API client (mock or real)
      if (this.config.useMockAPI) {
        const result = await this.apiClient.unsubscribe(subscriptionData);
        console.log('✅ Subscription removed from mock API successfully');
        return result;
      } else {
        // Send to real API
        const result = await this.sendToServer(this.config.endpoints.unsubscribe, subscriptionData);
        console.log('✅ Subscription removed from server successfully');
        return result;
      }
    } catch (error) {
      console.error('❌ Failed to remove subscription from server:', error);
      throw error;
    }
  }

  /**
   * Send local notification (for testing)
   */
  async sendLocalNotification(title, options = {}) {
    if (!this.isSupported) {
      return false;
    }

    const defaultOptions = {
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      actions: [
        {
          action: 'view',
          title: 'View Menu',
          icon: '/icon-72x72.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icon-72x72.png'
        }
      ],
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
        
        // Handle action clicks
        if (event.action === 'view') {
          // Navigate to menu
          window.location.href = '/';
        }
      };

      return notification;
    } catch (error) {
      console.error('Failed to send local notification:', error);
      return false;
    }
  }

  /**
   * Schedule meal time notifications
   */
  async scheduleMealNotification(mealName, mealTime, menuItems = []) {
    const now = new Date();
    const mealDateTime = new Date(mealTime);
    
    // Calculate time until meal (exactly at meal start time)
    const notificationTime = new Date(mealDateTime.getTime());
    
    // Import flirty notification generator
    const { generateMealTimeNotification } = await import('../utils/flirtyNotifications');
    const notificationData = generateMealTimeNotification(mealName, mealTime, menuItems);
    
    if (notificationTime <= now) {
      // Meal is starting now, send immediate notification
      return this.sendLocalNotification(
        notificationData.title,
        {
          body: notificationData.body,
          tag: notificationData.tag,
          data: notificationData.data
        }
      );
    } else {
      // Schedule notification for meal start time
      const delay = notificationTime.getTime() - now.getTime();
      
      setTimeout(() => {
        this.sendLocalNotification(
          notificationData.title,
          {
            body: notificationData.body,
            tag: notificationData.tag,
            data: notificationData.data
          }
        );
      }, delay);
    }
  }

  /**
   * Send menu update notification
   */
  async sendMenuUpdateNotification(messName, dayName, changes = []) {
    // Import flirty notification generator
    const { generateMenuUpdateNotification } = await import('../utils/flirtyNotifications');
    const notificationData = generateMenuUpdateNotification(messName, dayName, changes);
    
    return this.sendLocalNotification(
      notificationData.title,
      {
        body: notificationData.body,
        tag: notificationData.tag,
        data: notificationData.data
      }
    );
  }

  /**
   * Send special meal notification
   */
  async sendSpecialMealNotification(mealName, specialItems = []) {
    // Import flirty notification generator
    const { generateSpecialMealNotification } = await import('../utils/flirtyNotifications');
    const notificationData = generateSpecialMealNotification(mealName, specialItems);
    
    return this.sendLocalNotification(
      notificationData.title,
      {
        body: notificationData.body,
        tag: notificationData.tag,
        data: notificationData.data
      }
    );
  }

  /**
   * Send favorites notification
   */
  async sendFavoritesNotification(mealName, favoriteItems = []) {
    // Import flirty notification generator
    const { generateFavoritesNotification } = await import('../utils/flirtyNotifications');
    const notificationData = generateFavoritesNotification(mealName, favoriteItems);
    
    return this.sendLocalNotification(
      notificationData.title,
      {
        body: notificationData.body,
        tag: notificationData.tag,
        data: notificationData.data
      }
    );
  }

  /**
   * Convert VAPID key from base64 to Uint8Array
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Get subscription status
   */
  getSubscriptionStatus() {
    if (this.useFirebase) {
      return firebaseNotificationService.getSubscriptionStatus();
    } else {
      return freePushNotificationService.getSubscriptionStatus();
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences) {
    try {
      if (this.useFirebase) {
        // Use Firebase Cloud Messaging
        return await firebaseNotificationService.updatePreferences(preferences);
      } else {
        // Use free push notification service (localStorage)
        return await freePushNotificationService.updatePreferences(preferences);
      }
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      return false;
    }
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;
