/**
 * Mock Push Notification API for local testing
 * In production, this would be replaced with a real server endpoint
 */

class MockPushAPI {
  constructor() {
    this.subscriptions = new Map();
    this.preferences = new Map();
  }

  /**
   * Mock API endpoint for subscribing to push notifications
   */
  async subscribe(subscriptionData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const subscriptionId = this.generateSubscriptionId();
      this.subscriptions.set(subscriptionId, {
        id: subscriptionId,
        subscription: subscriptionData.subscription,
        userAgent: subscriptionData.userAgent,
        timestamp: subscriptionData.timestamp,
        preferences: {
          mealReminders: true,
          menuUpdates: true,
          specialMeals: true
        }
      });

      console.log('Mock API: Subscription created', subscriptionId);
      return { success: true, subscriptionId };
    } catch (error) {
      console.error('Mock API: Subscription failed', error);
      throw error;
    }
  }

  /**
   * Mock API endpoint for unsubscribing from push notifications
   */
  async unsubscribe(subscriptionData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find and remove subscription
      for (const [id, sub] of this.subscriptions.entries()) {
        if (sub.subscription.endpoint === subscriptionData.subscription.endpoint) {
          this.subscriptions.delete(id);
          console.log('Mock API: Subscription removed', id);
          break;
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Mock API: Unsubscribe failed', error);
      throw error;
    }
  }

  /**
   * Mock API endpoint for updating notification preferences
   */
  async updatePreferences(subscriptionData, preferences) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Find subscription and update preferences
      for (const [id, sub] of this.subscriptions.entries()) {
        if (sub.subscription.endpoint === subscriptionData.subscription.endpoint) {
          sub.preferences = { ...sub.preferences, ...preferences };
          console.log('Mock API: Preferences updated', id, preferences);
          break;
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Mock API: Update preferences failed', error);
      throw error;
    }
  }

  /**
   * Mock API endpoint for sending push notifications
   */
  async sendNotification(subscriptionId, notificationData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      console.log('Mock API: Notification sent', subscriptionId, notificationData);
      return { success: true, messageId: this.generateMessageId() };
    } catch (error) {
      console.error('Mock API: Send notification failed', error);
      throw error;
    }
  }

  /**
   * Mock API endpoint for sending notifications to all subscribers
   */
  async sendNotificationToAll(notificationData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const results = [];
      for (const [id, subscription] of this.subscriptions.entries()) {
        try {
          await this.sendNotification(id, notificationData);
          results.push({ subscriptionId: id, success: true });
        } catch (error) {
          results.push({ subscriptionId: id, success: false, error: error.message });
        }
      }

      console.log('Mock API: Bulk notification sent', results);
      return { success: true, results };
    } catch (error) {
      console.error('Mock API: Bulk notification failed', error);
      throw error;
    }
  }

  /**
   * Mock API endpoint for getting subscription statistics
   */
  async getStatistics() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const stats = {
        totalSubscriptions: this.subscriptions.size,
        activeSubscriptions: this.subscriptions.size,
        lastUpdated: new Date().toISOString(),
        preferences: {
          mealReminders: 0,
          menuUpdates: 0,
          specialMeals: 0
        }
      };

      // Calculate preference statistics
      for (const subscription of this.subscriptions.values()) {
        if (subscription.preferences.mealReminders) stats.preferences.mealReminders++;
        if (subscription.preferences.menuUpdates) stats.preferences.menuUpdates++;
        if (subscription.preferences.specialMeals) stats.preferences.specialMeals++;
      }

      return stats;
    } catch (error) {
      console.error('Mock API: Get statistics failed', error);
      throw error;
    }
  }

  /**
   * Generate a unique subscription ID
   */
  generateSubscriptionId() {
    return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate a unique message ID
   */
  generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Clear all mock data (for testing)
   */
  clear() {
    this.subscriptions.clear();
    this.preferences.clear();
    console.log('Mock API: All data cleared');
  }
}

// Create singleton instance
const mockPushAPI = new MockPushAPI();

export default mockPushAPI;
