/**
 * Push Notification Service for Messmate
 * Handles push notification registration, sending, and management
 */

import getNotificationConfig, { validateVAPIDConfig, validateAPIConfig } from '../config/notification.js';
import MockPushAPI from '../utils/mockPushAPI.js';

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
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered for push notifications');

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription();
      
      return true;
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

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else if (permission === 'denied') {
      console.log('Notification permission denied');
      return false;
    } else {
      console.log('Notification permission dismissed');
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe() {
    if (!this.isSupported || !this.registration) {
      throw new Error('Push notifications not initialized');
    }

    try {
      // Check if we should skip VAPID (development mode)
      if (this.config.skipVAPID) {
        console.log('🔧 Development mode: Skipping push subscription, using local notifications only');
        
        // Just request permission for local notifications
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('✅ Local notification permission granted');
          return { permission: 'granted' };
        } else {
          throw new Error('Notification permission denied');
        }
      }

      // For production, use proper push subscription
      const subscribeOptions = {
        userVisibleOnly: true
      };

      // Add VAPID key for production
      if (this.vapidPublicKey && this.vapidPublicKey !== 'YOUR_VAPID_PUBLIC_KEY_HERE') {
        const vapidPublicKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
        subscribeOptions.applicationServerKey = vapidPublicKey;
        console.log('🔑 Using VAPID public key for push subscription');
      } else {
        console.warn('⚠️ No VAPID public key configured, push notifications may not work');
      }

      // Subscribe to push manager
      this.subscription = await this.registration.pushManager.subscribe(subscribeOptions);
      console.log('✅ Push subscription created successfully');

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      console.log('Successfully subscribed to push notifications');
      return this.subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe() {
    if (!this.subscription) {
      return false;
    }

    try {
      await this.subscription.unsubscribe();
      await this.removeSubscriptionFromServer(this.subscription);
      
      this.subscription = null;
      console.log('✅ Successfully unsubscribed from push notifications');
      return true;
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
    return {
      isSupported: this.isSupported,
      isSubscribed: !!this.subscription,
      permission: Notification.permission
    };
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences) {
    try {
      // For local development, use mock API
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        const mockAPI = await import('../utils/mockPushAPI');
        const result = await mockAPI.default.updatePreferences(
          this.subscription?.toJSON(),
          preferences
        );
        console.log('Notification preferences updated in mock API successfully');
        return true;
      }

      // For production, use real API
      const response = await fetch(`${this.serverUrl}/api/push/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: this.subscription?.toJSON(),
          preferences: preferences
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      console.log('Notification preferences updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      return false;
    }
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;
