import { useEffect } from 'react';
import { useNotifications } from './useNotifications.jsx';
import { hasSimilarFavorite } from '../utils/itemMatching';
import { getFlirtyFoodMessage } from '../utils/flirtyNotifications';

/**
 * Hook for showing notifications when favorites are available in current meal
 * @param {Array} menuItems - Current menu items
 * @param {Array} favorites - User's favorite items
 * @param {Object} ratings - Item ratings
 * @param {boolean} enabled - Whether notifications are enabled
 */
export const useFavoriteNotifications = (menuItems, favorites, ratings, enabled = true) => {
  const { showCustomNotification } = useNotifications({ enabled });

  useEffect(() => {
    if (!enabled || !menuItems.length || !favorites.length) return;

    // Find favorite items in current menu
    const availableFavorites = menuItems.filter(item => 
      favorites.includes(item) || hasSimilarFavorite(item, favorites)
    );

    // Show notification if favorites are available (but not too frequently)
    if (availableFavorites.length > 0) {
      // Use a random delay to make it feel more natural
      const delay = Math.random() * 2000 + 1000; // 1-3 seconds
      
      setTimeout(() => {
        const favoriteItem = availableFavorites[0];
        const isFavorite = favorites.includes(favoriteItem) || hasSimilarFavorite(favoriteItem, favorites);
        const rating = ratings[favoriteItem] || 0;
        const isSpecial = favoriteItem.includes('**');
        
        const message = getFlirtyFoodMessage(favoriteItem, isFavorite, rating, isSpecial);
        
        showCustomNotification(message, {
          type: 'success',
          emoji: '😍',
          duration: 4000,
          onClick: () => {
            // Could scroll to the favorite item or highlight it
            console.log('Clicked on favorite notification:', favoriteItem);
          },
        });
      }, delay);
    }
  }, [menuItems, favorites, ratings, enabled, showCustomNotification]);
};

/**
 * Hook for showing notifications about special items
 * @param {Array} menuItems - Current menu items
 * @param {boolean} enabled - Whether notifications are enabled
 */
export const useSpecialItemNotifications = (menuItems, enabled = true) => {
  const { showCustomNotification } = useNotifications({ enabled });

  useEffect(() => {
    if (!enabled || !menuItems.length) return;

    // Find special items (marked with **)
    const specialItems = menuItems.filter(item => item.includes('**'));

    if (specialItems.length > 0) {
      // Show notification for special items with a delay
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      
      setTimeout(() => {
        const specialItem = specialItems[0].replace(/\*\*/g, '');
        const message = getFlirtyFoodMessage(specialItem, false, 0, true);
        
        showCustomNotification(message, {
          type: 'success',
          emoji: '👑',
          duration: 4000,
        });
      }, delay);
    }
  }, [menuItems, enabled, showCustomNotification]);
};