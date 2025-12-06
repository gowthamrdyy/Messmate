import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Search, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { FOOD_EMOJIS } from '../../utils/constants';
import communityRatings from '../../services/communityRatings';

const RateFoodModal = ({ isOpen, onClose, menuData, selectedMess, currentDate, currentMeal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Get all unique dishes from menu
  const allDishes = useMemo(() => {
    const dishes = new Set();
    const messMenu = menuData[selectedMess] || {};

    Object.values(messMenu).forEach(meals => {
      Object.values(meals).forEach(items => {
        items.forEach(item => {
          const cleanItem = item.replace(/\*\*/g, '').trim();
          dishes.add(cleanItem);
        });
      });
    });

    return Array.from(dishes).sort();
  }, [menuData, selectedMess]);

  // Filter dishes based on search
  const filteredDishes = useMemo(() => {
    if (!searchTerm.trim()) return allDishes;

    return allDishes.filter(dish =>
      dish.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allDishes, searchTerm]);

  const getFoodEmoji = (item) => {
    const cleanItem = item.toLowerCase().trim();

    for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
      if (key !== 'default' && cleanItem.includes(key)) {
        return emoji;
      }
    }
    return FOOD_EMOJIS.default;
  };

  const handleRate = async (dish, rating) => {
    if (!currentDate || !currentMeal) return;

    try {
      const { day, meal } = communityRatings.getCurrentMealContext(currentDate, currentMeal);
      await communityRatings.addRating(dish, rating, selectedMess, day, meal);

      // Force re-render by updating search term slightly
      setSearchTerm(prev => prev + ' ');
      setTimeout(() => setSearchTerm(prev => prev.trim()), 10);
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  const renderStars = (dish) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;

      return (
        <motion.button
          key={index}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRate(dish, starValue)}
          className="cursor-pointer transition-colors duration-200 text-surface-300 dark:text-white/20 hover:text-yellow-400 p-0.5"
        >
          <Star size={18} className="fill-current" />
        </motion.button>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-nebula-dark/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl"
        >
          <div className="bg-surface-100 dark:bg-nebula-dark border border-white/20 dark:border-white/10 h-full flex flex-col">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-nebula-secondary/10 rounded-xl">
                    <Users className="w-6 h-6 text-nebula-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-text-primary">
                      Community Ratings
                    </h3>
                    <p className="text-xs text-text-secondary">Rate dishes to help others</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-surface-200 dark:hover:bg-white/10 transition-colors text-text-secondary"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {/* Search */}
              <div className="relative mb-6 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-text-tertiary group-focus-within:text-nebula-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-white/20 dark:border-white/10 rounded-xl bg-surface-200 dark:bg-white/5 text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-nebula-primary/50 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* Current Meal Context */}
              {currentDate && currentMeal && (
                <div className="mb-6 p-4 bg-nebula-primary/5 rounded-2xl border border-nebula-primary/10 flex items-center gap-3">
                  <div className="w-1 h-10 bg-nebula-primary rounded-full" />
                  <div className="text-sm text-text-primary">
                    <span className="font-bold block text-nebula-primary mb-0.5">Rating Context</span>
                    {currentMeal} • {currentDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}

              {/* Food Items List */}
              <div className="space-y-3">
                {filteredDishes.map((dish, index) => {
                  const { day, meal } = currentDate && currentMeal ?
                    communityRatings.getCurrentMealContext(currentDate, currentMeal) :
                    { day: null, meal: null };
                  const communityRating = day && meal ?
                    communityRatings.getRating(dish, selectedMess, day, meal) :
                    null;

                  return (
                    <motion.div
                      key={dish}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface-100 dark:bg-white/5 border border-white/20 dark:border-white/5 hover:border-nebula-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {getFoodEmoji(dish)}
                        </span>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-text-primary truncate group-hover:text-nebula-primary transition-colors">
                            {dish}
                          </span>
                          {communityRating && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-md border border-yellow-400/20">
                                ⭐ {communityRating.rating}
                              </span>
                              <span className="text-xs text-text-tertiary">
                                ({communityRating.count} ratings)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-4 bg-surface-200 dark:bg-black/20 p-1.5 rounded-xl">
                        {renderStars(dish)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredDishes.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3 opacity-50">🔍</div>
                  <p className="text-text-secondary font-medium">No food items found matching "{searchTerm}"</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-text-tertiary text-center font-medium">
                  🌟 Your ratings help the community! Ratings are shared with all users
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RateFoodModal;