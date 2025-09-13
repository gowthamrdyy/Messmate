import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { StaggerContainer, StaggerItem } from '../ui/PageTransition';
import { FOOD_EMOJIS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

const FavoritesSection = ({ className = '' }) => {
  const { favorites, removeFromFavorites } = useAppStore();
  const [removingItem, setRemovingItem] = useState(null);

  // Manual HTML icons as fallbacks
  const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M3 6h18"></path>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M8 2v4"></path>
      <path d="M16 2v4"></path>
      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
      <path d="M3 10h18"></path>
    </svg>
  );

  // Get food emoji for item
  const getFoodEmoji = (item) => {
    const cleanItem = item.toLowerCase().replace(/\*\*/g, '').trim();
    
    // Check for exact matches first
    if (FOOD_EMOJIS[cleanItem]) {
      return FOOD_EMOJIS[cleanItem];
    }
    
    // Check for partial matches
    for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
      if (cleanItem.includes(key) || key.includes(cleanItem)) {
        return emoji;
      }
    }
    
    return FOOD_EMOJIS.default;
  };

  const handleRemoveFavorite = async (item) => {
    setRemovingItem(item);
    
    // Add a small delay for animation
    setTimeout(() => {
      removeFromFavorites(item);
      setRemovingItem(null);
    }, 200);
  };

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center py-12 ${className}`}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="text-6xl mb-4"
        >
          💔
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Favorites Yet
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
          Start adding your favorite dishes by tapping the heart icon on menu items!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            Your Favorites
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({favorites.length})
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <StaggerContainer staggerDelay={0.1}>
            <div className="space-y-3">
              {favorites.map((item, index) => (
                <StaggerItem key={`${item}-${index}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ 
                      opacity: removingItem === item ? 0 : 1,
                      scale: removingItem === item ? 0.8 : 1
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <span className="text-lg flex-shrink-0">
                      {getFoodEmoji(item)}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {item.replace(/\*\*/g, '')}
                      </p>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveFavorite(item)}
                      disabled={removingItem === item}
                      className="p-1.5 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                      aria-label={`Remove ${item} from favorites`}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
          
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                💡 Tip: You'll get notified when your favorite items are available in the menu!
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FavoritesSection;