import { useState, useEffect, useCallback } from 'react';
import pushNotificationService from '../services/pushNotificationService';

/**
 * Hook for managing push notifications
 */
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize push notifications
  useEffect(() => {
    const initializePushNotifications = async () => {
      try {
        const initialized = await pushNotificationService.initialize();
        setIsSupported(initialized);
        
        if (initialized) {
          const status = pushNotificationService.getSubscriptionStatus();
          setIsSubscribed(status.isSubscribed);
          setPermission(status.permission);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    initializePushNotifications();
  }, []);

  // Request permission and subscribe
  const subscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const permissionGranted = await pushNotificationService.requestPermission();
      
      if (permissionGranted) {
        const result = await pushNotificationService.subscribe();
        
        // Handle local development case
        if (result && result.permission === 'granted') {
          setIsSubscribed(true);
          setPermission('granted');
        } else if (result) {
          setIsSubscribed(true);
          setPermission('granted');
        }
      } else {
        setPermission('denied');
        throw new Error('Notification permission denied');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Unsubscribe
  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await pushNotificationService.unsubscribe();
      setIsSubscribed(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    try {
      // Import flirty notification generator
      const { generateTestNotification } = await import('../utils/flirtyNotifications');
      const notificationData = generateTestNotification();
      
      await pushNotificationService.sendLocalNotification(
        notificationData.title,
        {
          body: notificationData.body,
          tag: notificationData.tag,
          data: notificationData.data
        }
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Schedule meal notification
  const scheduleMealNotification = useCallback(async (mealName, mealTime, menuItems = []) => {
    try {
      await pushNotificationService.scheduleMealNotification(mealName, mealTime, menuItems);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Send menu update notification
  const sendMenuUpdateNotification = useCallback(async (messName, dayName, changes = []) => {
    try {
      await pushNotificationService.sendMenuUpdateNotification(messName, dayName, changes);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Send special meal notification
  const sendSpecialMealNotification = useCallback(async (mealName, specialItems = []) => {
    try {
      await pushNotificationService.sendSpecialMealNotification(mealName, specialItems);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Send favorites notification
  const sendFavoritesNotification = useCallback(async (mealName, favoriteItems = []) => {
    try {
      await pushNotificationService.sendFavoritesNotification(mealName, favoriteItems);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (preferences) => {
    try {
      await pushNotificationService.updatePreferences(preferences);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    // State
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    
    // Actions
    subscribe,
    unsubscribe,
    sendTestNotification,
    scheduleMealNotification,
    sendMenuUpdateNotification,
    sendSpecialMealNotification,
    sendFavoritesNotification,
    updatePreferences,
    
    // Utility
    canSubscribe: isSupported && permission !== 'denied' && !isSubscribed,
    canUnsubscribe: isSupported && isSubscribed,
    canSendNotifications: isSupported && permission === 'granted'
  };
};

export default usePushNotifications;
