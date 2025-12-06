import { AnimatePresence, motion } from 'framer-motion';
import { useState, memo, useMemo, useCallback } from 'react';
import { Heart, ChevronLeft, ChevronRight, Calendar, Clock, Share2 } from 'lucide-react';
import { FOOD_EMOJIS } from '../../utils/constants';
import { hasSimilarFavorite, getMatchingFavorite } from '../../utils/itemMatching';
import useAppStore from '../../store/useAppStore';
import MenuCorrection from './MenuCorrection';

const QuantumMenuCard = memo(({
  meal,
  menuItems = [],
  dayLabel = '',
  currentDate,
  className = '',
  onPrevious,
  onNext,
  onGoLive,
  isLive = false,
  disabled = false,
  ...props
}) => {
  const { favorites, toggleFavorite } = useAppStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentMenuItems, setCurrentMenuItems] = useState(menuItems);

  // Get food emoji with enhanced matching
  const getFoodEmoji = useCallback((item) => {
    const itemLower = item.toLowerCase().trim();
    const cleanItem = itemLower.replace(/\*\*/g, '').replace(/\//g, ' ').replace(/\s+/g, ' ').trim();

    for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
      if (key === 'default') continue;
      if (cleanItem.includes(key) || key.includes(cleanItem)) {
        return emoji;
      }
    }
    return FOOD_EMOJIS.default;
  }, []);

  // Update current menu items when props change
  useMemo(() => {
    setCurrentMenuItems(menuItems);
  }, [menuItems]);

  // Process menu items
  const processedMenuItems = useMemo(() => {
    return currentMenuItems.map((item, index) => {
      const isFavorite = favorites.includes(item) || hasSimilarFavorite(item, favorites);
      const emoji = getFoodEmoji(item);

      return {
        id: `item-${index}`,
        name: item,
        emoji,
        isFavorite,
      };
    });
  }, [currentMenuItems, favorites, getFoodEmoji]);

  const handleToggleFavorite = useCallback((item) => {
    const matchingFavorite = getMatchingFavorite(item.name, favorites);
    const targetItem = matchingFavorite || item.name;
    toggleFavorite(targetItem);
  }, [favorites, toggleFavorite]);

  const getFormattedDate = () => {
    const dateToShow = currentDate || new Date();
    return dateToShow.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`card-glass p-6 relative overflow-hidden ${className}`} {...props}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-nebula-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-nebula-secondary/5 rounded-full blur-xl -ml-8 -mb-8" />

      {/* Header with Navigation */}
      <div className="relative flex items-center justify-between mb-6">
        <button
          onClick={onPrevious}
          disabled={disabled || !onPrevious}
          className="p-2.5 rounded-xl bg-surface-200/50 dark:bg-white/5 hover:bg-surface-300/50 dark:hover:bg-white/10 text-text-secondary transition-all disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center flex-1 px-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold tracking-wider text-nebula-primary uppercase bg-nebula-primary/10 px-2 py-0.5 rounded-md">
              {meal?.name || 'Menu'}
            </span>

            <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary">
              {getFormattedDate()}
            </h2>

            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <span className="capitalize">{dayLabel}</span>
              {isLive && (
                <span className="flex items-center gap-1.5 text-nebula-success font-medium bg-nebula-success/10 px-2 py-0.5 rounded-full text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nebula-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-nebula-success"></span>
                  </span>
                  Live
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={disabled || !onNext}
          className="p-2.5 rounded-xl bg-surface-200/50 dark:bg-white/5 hover:bg-surface-300/50 dark:hover:bg-white/10 text-text-secondary transition-all disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Go Live Button (if not live) */}
      {!isLive && (
        <div className="flex justify-center mb-6">
          <button
            onClick={onGoLive}
            className="flex items-center gap-2 px-4 py-2 bg-surface-200 dark:bg-white/5 hover:bg-surface-300 dark:hover:bg-white/10 text-text-secondary rounded-full text-sm font-medium transition-all group"
          >
            <Clock size={16} className="group-hover:text-nebula-primary transition-colors" />
            <span>Jump to Current Meal</span>
          </button>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {processedMenuItems.map((item) => (
          <motion.div
            key={item.id}
            layoutId={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative flex items-center gap-4 p-4 bg-surface-100/50 dark:bg-white/5 hover:bg-surface-100 dark:hover:bg-white/10 border border-white/40 dark:border-white/5 rounded-2xl cursor-pointer transition-all hover:shadow-soft hover:scale-[1.01]"
          >
            <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
              {item.emoji}
            </span>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary text-base truncate pr-2">
                {item.name}
              </h3>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(item);
              }}
              className={`p-2 rounded-full transition-all duration-300 ${item.isFavorite
                  ? 'bg-nebula-secondary/10 text-nebula-secondary'
                  : 'bg-transparent text-text-tertiary hover:bg-surface-200 dark:hover:bg-white/10'
                }`}
            >
              <Heart
                size={18}
                className={`transition-transform duration-300 ${item.isFavorite ? 'fill-current scale-110' : 'group-hover:scale-110'}`}
              />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Community Menu Corrections */}
      <div className="mt-6 pt-4 border-t border-glass-border">
        <MenuCorrection
          meal={meal}
          date={currentDate}
          menuItems={currentMenuItems}
          onMenuUpdate={setCurrentMenuItems}
        />
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-nebula-dark/60 backdrop-blur-sm"
            />

            <motion.div
              layoutId={selectedItem.id}
              className="relative w-full max-w-sm bg-surface-100 dark:bg-nebula-dark border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-nebula-primary/20 blur-3xl rounded-full -mt-16" />

              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  className="text-6xl mb-6 filter drop-shadow-lg"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedItem.emoji}
                </motion.div>

                <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                  {selectedItem.name}
                </h2>

                <p className="text-text-secondary text-sm mb-8">
                  Available in {meal?.name}
                </p>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={() => {
                      handleToggleFavorite(selectedItem);
                      setSelectedItem(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${selectedItem.isFavorite
                        ? 'bg-nebula-secondary/10 text-nebula-secondary hover:bg-nebula-secondary/20'
                        : 'bg-surface-200 dark:bg-white/5 text-text-primary hover:bg-surface-300 dark:hover:bg-white/10'
                      }`}
                  >
                    <Heart size={18} className={selectedItem.isFavorite ? 'fill-current' : ''} />
                    {selectedItem.isFavorite ? 'Liked' : 'Like'}
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-nebula-primary/10 text-nebula-primary hover:bg-nebula-primary/20 transition-all"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

QuantumMenuCard.displayName = 'QuantumMenuCard';

export default QuantumMenuCard;