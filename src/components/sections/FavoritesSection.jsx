import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { StaggerContainer, StaggerItem } from '../ui/PageTransition';
import { FOOD_EMOJIS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';
import QuickStats from '../ui/QuickStats';

const FavoritesSection = ({ className = '', menuData, selectedMess }) => {
  const { favorites, removeFromFavorites } = useAppStore();
  const [removingItem, setRemovingItem] = useState(null);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-6 ${className}`}
    >
      {/* Quick Stats */}
      {menuData && selectedMess && (
        <QuickStats
          menuData={menuData}
          selectedMess={selectedMess}
          className="w-full"
        />
      )}

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="card-glass p-8 text-center max-w-sm mx-auto bg-surface-100/50 dark:bg-nebula-dark/50">
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
              className="text-6xl mb-6"
            >
              💔
            </motion.div>

            <h3 className="font-display font-bold text-xl text-text-primary mb-3">
              No Favorites Yet
            </h3>

            <p className="text-text-secondary leading-relaxed">
              Start adding your favorite dishes by tapping the heart icon on menu items!
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="card-glass p-6 bg-surface-100/90 dark:bg-nebula-dark/90 backdrop-blur-xl border-white/20 dark:border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-nebula-error/10 rounded-xl">
              <Heart className="w-5 h-5 text-nebula-error fill-current" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary">
                Your Favorites
              </h2>
              <p className="text-sm text-text-secondary">
                {favorites.length} items saved
              </p>
            </div>
          </div>

          <StaggerContainer staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-200 dark:bg-white/5 border border-white/10 hover:border-nebula-error/30 transition-all group"
                  >
                    <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      {getFoodEmoji(item)}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-primary truncate group-hover:text-nebula-error transition-colors">
                        {item.replace(/\*\*/g, '')}
                      </p>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveFavorite(item)}
                      disabled={removingItem === item}
                      className="p-2 rounded-lg text-text-tertiary hover:text-nebula-error hover:bg-nebula-error/10 transition-colors disabled:opacity-50"
                      aria-label={`Remove ${item} from favorites`}
                    >
                      <Trash2 size={18} />
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
              className="mt-6 pt-4 border-t border-white/10"
            >
              <p className="text-xs font-medium text-text-tertiary text-center flex items-center justify-center gap-2">
                <span className="text-lg">💡</span>
                You'll get notified when your favorite items are available in the menu!
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FavoritesSection;