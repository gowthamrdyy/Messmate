import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { NOTIFICATION_MESSAGES } from '../utils/constants';
import { generateMealTimeNotification } from '../utils/flirtyNotifications';
import { formatTime } from '../utils/dateHelpers';
import { getScheduleForDay } from '../utils/mealSchedule';
import { hasSimilarFavorite } from '../utils/itemMatching';
import notificationService from '../services/notificationService';
import useAppStore from '../store/useAppStore';

/**
 * Custom hook for managing notifications
 * @param {Object} options - Configuration options
 * @returns {Object} - Notification functions
 */
export const useNotifications = (options = {}) => {
  const {
    enabled = true,
    mealTimeNotifications = true,
    menuUpdateNotifications = true,
  } = options;

  // Get a random message from an array
  const getRandomMessage = useCallback((messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  // Format message with meal name
  const formatMessage = useCallback((template, mealName) => {
    return template.replace('{meal}', mealName);
  }, []);

  // Show meal time notification with flirty food messages
  const showMealTimeNotification = useCallback(async (meal, menuItems = [], emoji = '🍽️') => {
    if (!enabled || !mealTimeNotifications) return;

    // Get current app state for favorites and ratings
    const { favorites, ratings } = useAppStore.getState();
    
    // Check for favorite items in the menu
    const availableFavorites = menuItems.filter(item => 
      hasSimilarFavorite(item, favorites)
    );

    // Generate flirty message based on available items
    const notificationData = generateMealTimeNotification(meal.name, new Date(), menuItems);
    const message = notificationData.body;
    const timeRange = `${formatTime(meal.start.hour, meal.start.min)} - ${formatTime(meal.end.hour, meal.end.min)}`;

    // Show browser/mobile notification
    await notificationService.showMealNotification(meal.name, menuItems, emoji);

    // Also show in-app toast
    toast.success(
      (t) => (
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => {
            toast.dismiss(t.id);
          }}
        >
          <span className="text-2xl">{emoji}</span>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {message}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {timeRange}
            </div>
            {availableFavorites.length > 0 && (
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                ⭐ {availableFavorites.length} favorite{availableFavorites.length > 1 ? 's' : ''} available!
              </div>
            )}
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: 'top-center',
        style: {
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          color: 'var(--text-primary)',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#FFFFFF',
        },
      }
    );
  }, [enabled, mealTimeNotifications]);

  // Show menu update notification
  const showMenuUpdateNotification = useCallback(() => {
    if (!enabled || !menuUpdateNotifications) return;

    const message = getRandomMessage(NOTIFICATION_MESSAGES.MENU_UPDATE);

    toast(
      (t) => (
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📋</span>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {message}
            </div>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // You can add navigation logic here
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Menu →
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          color: 'var(--text-primary)',
        },
        icon: '📋',
      }
    );
  }, [enabled, menuUpdateNotifications, getRandomMessage]);

  // Show custom notification
  const showCustomNotification = useCallback((message, options = {}) => {
    if (!enabled) return;

    const {
      type = 'success',
      emoji = '💡',
      duration = 3000,
      onClick,
    } = options;

    const toastFunction = type === 'error' ? toast.error : 
                         type === 'loading' ? toast.loading : 
                         toast.success;

    toastFunction(
      (t) => (
        <div 
          className={`flex items-center space-x-3 ${onClick ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (onClick) {
              onClick();
              toast.dismiss(t.id);
            }
          }}
        >
          <span className="text-2xl">{emoji}</span>
          <div className="font-medium text-gray-900 dark:text-white">
            {message}
          </div>
        </div>
      ),
      {
        duration,
        position: 'top-center',
        style: {
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          color: 'var(--text-primary)',
        },
      }
    );
  }, [enabled]);

  // Show favorite notification
  const showFavoriteNotification = useCallback(async (itemName, isAdded) => {
    if (!enabled) return;

    const message = isAdded 
      ? `Added ${itemName} to favorites! ⭐`
      : `Removed ${itemName} from favorites`;
    
    const emoji = isAdded ? '❤️' : '💔';

    // Show mobile notification for favorites
    if (isAdded) {
      await notificationService.showFavoriteAvailableNotification(itemName);
    }

    showCustomNotification(message, {
      type: isAdded ? 'success' : 'default',
      emoji,
      duration: 2000,
    });
  }, [enabled, showCustomNotification]);

  return {
    showMealTimeNotification,
    showMenuUpdateNotification,
    showCustomNotification,
    showFavoriteNotification,
  };
};

/**
 * Hook for automatic meal time notifications
 * @param {Object} mealNavigation - Current meal navigation state
 * @param {Date} currentTime - Current time
 * @param {Array} menuItems - Current menu items
 * @param {boolean} enabled - Whether notifications are enabled
 */
export const useMealTimeNotifications = (mealNavigation, currentTime, menuItems = [], enabled = true) => {
  const { showMealTimeNotification } = useNotifications({ enabled });

  useEffect(() => {
    if (!enabled) return;

    // Only show notifications for current day
    if (mealNavigation.dayOffset !== 0) return;

    const schedule = getScheduleForDay(currentTime);
    const now = new Date();
    
    // Check all meals for notification timing
    schedule.forEach((meal, index) => {
      const mealStartTime = new Date(now);
      mealStartTime.setHours(meal.start.hour, meal.start.min, 0, 0);
      
      // Notify 5 minutes before meal starts
      const notificationTime = new Date(mealStartTime.getTime() - 5 * 60 * 1000);
      const timeDiff = now.getTime() - notificationTime.getTime();
      
      // Check if it's time to notify (within 1 minute window)
      const shouldNotify = timeDiff >= 0 && timeDiff <= 60000;
      
      if (shouldNotify) {
        // Get appropriate emoji for meal
        const mealEmojis = {
          'Breakfast': '🌅',
          'Lunch': '🍛',
          'Snacks': '🍪',
          'Dinner': '🌙',
        };
        
        const emoji = mealEmojis[meal.name] || '🍽️';
        
        // Get menu items for this specific meal
        const { selectedMess } = useAppStore.getState();
        // This would need to be passed from the parent component
        showMealTimeNotification(meal, menuItems, emoji);
      }
    });
  }, [currentTime, enabled, showMealTimeNotification, menuItems]);
};

/**
 * Hook for menu update notifications (simulated)
 * @param {boolean} enabled - Whether notifications are enabled
 */
export const useMenuUpdateNotifications = (enabled = true) => {
  const { showMenuUpdateNotification } = useNotifications({ enabled });

  useEffect(() => {
    if (!enabled) return;

    // Simulate menu update notification (e.g., at midnight)
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    
    // Check if it's just past midnight (within 5 minutes)
    const timeDiff = now.getTime() - midnight.getTime();
    const isJustPastMidnight = timeDiff >= 0 && timeDiff <= 300000; // Within 5 minutes
    
    if (isJustPastMidnight) {
      setTimeout(() => {
        showMenuUpdateNotification();
      }, 2000); // Delay to avoid immediate notification
    }
  }, [enabled, showMenuUpdateNotification]);
};