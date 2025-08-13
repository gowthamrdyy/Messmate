/**
 * Free Push Notification Service for Messmate
 * Uses traditional web push notifications without any paid services
 */

class FreePushNotificationService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.registration = null;
    this.subscription = null;
    this.serverUrl = import.meta.env.VITE_API_BASE_URL || 'https://your-free-api.com';
    
    // VAPID keys (you can generate these for free)
    this.vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'YOUR_FREE_VAPID_PUBLIC_KEY';
    
    console.log('🚀 Free push notification service initialized');
  }

  /**
   * Initialize the service
   */
  async initialize() {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered for free push notifications');

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize free push notifications:', error);
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

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        return { success: true, permission: 'granted' };
      } else if (permission === 'denied') {
        console.log('❌ Notification permission denied');
        return { success: false, permission: 'denied' };
      } else {
        console.log('⚠️ Notification permission dismissed');
        return { success: false, permission: 'dismissed' };
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      throw error;
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
      if (import.meta.env.DEV) {
        console.log('🔧 Development mode: Using local notifications only');
        
        // Just request permission for local notifications
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('✅ Local notification permission granted');
          return { success: true, permission: 'granted' };
        } else {
          throw new Error('Notification permission denied');
        }
      }

      // For production, use proper push subscription
      const subscribeOptions = {
        userVisibleOnly: true
      };

      // Add VAPID key for production
      if (this.vapidPublicKey && this.vapidPublicKey !== 'YOUR_FREE_VAPID_PUBLIC_KEY') {
        const vapidPublicKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
        subscribeOptions.applicationServerKey = vapidPublicKey;
        console.log('🔑 Using VAPID public key for push subscription');
      } else {
        console.warn('⚠️ No VAPID public key configured, using local notifications only');
        // Fall back to local notifications
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('✅ Local notification permission granted');
          return { success: true, permission: 'granted' };
        } else {
          throw new Error('Notification permission denied');
        }
      }

      // Subscribe to push manager
      this.subscription = await this.registration.pushManager.subscribe(subscribeOptions);
      console.log('✅ Push subscription created successfully');

      // Send subscription to server (optional - for server-side notifications)
      await this.sendSubscriptionToServer(this.subscription);

      console.log('✅ Successfully subscribed to free push notifications');
      return { success: true, subscription: this.subscription };
    } catch (error) {
      console.error('❌ Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe() {
    try {
      if (!this.subscription) {
        return false;
      }

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
   * Send subscription to server (optional)
   */
  async sendSubscriptionToServer(subscription) {
    try {
      // Only send if you have a server endpoint
      if (this.serverUrl && this.serverUrl !== 'https://your-free-api.com') {
        const response = await fetch(`${this.serverUrl}/api/notifications/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription: subscription.toJSON(),
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Subscription sent to server successfully');
        return result;
      } else {
        console.log('ℹ️ No server URL configured, skipping server registration');
        return { success: true, message: 'Local notifications only' };
      }
    } catch (error) {
      console.error('❌ Failed to send subscription to server:', error);
      // Don't throw error - local notifications will still work
      return { success: false, error: error.message };
    }
  }

  /**
   * Remove subscription from server (optional)
   */
  async removeSubscriptionFromServer(subscription) {
    try {
      // Only send if you have a server endpoint
      if (this.serverUrl && this.serverUrl !== 'https://your-free-api.com') {
        const response = await fetch(`${this.serverUrl}/api/notifications/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription: subscription.toJSON(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Subscription removed from server successfully');
        return result;
      } else {
        console.log('ℹ️ No server URL configured, skipping server unregistration');
        return { success: true, message: 'Local notifications only' };
      }
    } catch (error) {
      console.error('❌ Failed to remove subscription from server:', error);
      // Don't throw error - local notifications will still work
      return { success: false, error: error.message };
    }
  }

  /**
   * Send local notification (works without any server)
   */
  async sendLocalNotification(title, options = {}) {
    if (!this.isSupported) {
      return false;
    }

    const defaultOptions = {
      icon: '/pwa-192x192.png',
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
      permission: Notification.permission,
      hasToken: !!this.subscription
    };
  }

  /**
   * Get current FCM token or subscription endpoint
   */
  getCurrentToken() {
    if (this.subscription) {
      const subscriptionData = this.subscription.toJSON();
      return subscriptionData.endpoint || 'Local notification subscription';
    }
    return null;
  }

  /**
   * Update notification preferences (local storage)
   */
  async updatePreferences(preferences) {
    try {
      // Store preferences in localStorage (free!)
      localStorage.setItem('messmate_notification_preferences', JSON.stringify(preferences));
      console.log('✅ Notification preferences updated in localStorage');
      return true;
    } catch (error) {
      console.error('❌ Failed to update notification preferences:', error);
      return false;
    }
  }

  /**
   * Get notification preferences (local storage)
   */
  getPreferences() {
    try {
      const stored = localStorage.getItem('messmate_notification_preferences');
      return stored ? JSON.parse(stored) : {
        mealReminders: true,
        menuUpdates: true,
        specialMeals: true,
        testNotifications: false
      };
    } catch (error) {
      console.error('❌ Failed to get notification preferences:', error);
      return {
        mealReminders: true,
        menuUpdates: true,
        specialMeals: true,
        testNotifications: false
      };
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // No cleanup needed for free service
  }
}

// Create singleton instance
const freePushNotificationService = new FreePushNotificationService();

export default freePushNotificationService;
