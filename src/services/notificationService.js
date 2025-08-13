/**
 * Notification Service for handling browser and push notifications
 */

class NotificationService {
  constructor() {
    this.permission = 'default';
    this.registration = null;
    this.init();
  }

  async init() {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    // Check current permission
    this.permission = Notification.permission;

    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async showNotification(title, options = {}) {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return null;
    }

    const defaultOptions = {
      icon: '/pwa-192x192.png',
      badge: '/Messmate.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      silent: false,
      tag: 'messmate-notification',
      renotify: true,
      ...options
    };

    try {
      // Use service worker for better mobile support
      if (this.registration && this.registration.showNotification) {
        return await this.registration.showNotification(title, defaultOptions);
      } else {
        // Fallback to regular notification
        return new Notification(title, defaultOptions);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }

  async showMealNotification(mealName, menuItems = [], emoji = '🍽️') {
    const title = `${emoji} ${mealName} Time!`;
    
    // Find favorite or special items
    const specialItems = menuItems.filter(item => item.includes('**'));
    const highlightItem = specialItems.length > 0 
      ? specialItems[0].replace(/\*\*/g, '') 
      : menuItems[0];

    const body = highlightItem 
      ? `Featuring ${highlightItem} and more delicious items!`
      : 'Check out today\'s menu!';

    return await this.showNotification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/Messmate.png',
      tag: 'meal-notification',
      data: {
        type: 'meal',
        mealName,
        menuItems,
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'View Menu',
          icon: '/Messmate.png'
        }
      ]
    });
  }

  async showFavoriteAvailableNotification(itemName) {
    const title = '⭐ Your Favorite is Here!';
    const body = `${itemName} is available in today's menu!`;

    return await this.showNotification(title, {
      body,
      tag: 'favorite-notification',
      data: {
        type: 'favorite',
        itemName,
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'View Menu',
          icon: '/Messmate.png'
        }
      ]
    });
  }

  async scheduleNotification(scheduledTime, title, options = {}) {
    // Calculate delay until scheduled time
    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      // Time has already passed, show immediately
      return await this.showNotification(title, options);
    }

    // Schedule for later
    setTimeout(async () => {
      await this.showNotification(title, options);
    }, delay);

    return { scheduled: true, delay };
  }

  // Check if notifications are supported and enabled
  isSupported() {
    return 'Notification' in window;
  }

  isEnabled() {
    return this.permission === 'granted';
  }

  // Get permission status
  getPermission() {
    return this.permission;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;