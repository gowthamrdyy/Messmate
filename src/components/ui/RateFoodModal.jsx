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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRate(dish, starValue)}
          className="cursor-pointer transition-colors duration-200 text-gray-300 dark:text-gray-600 hover:text-yellow-400"
        >
          <Star size={16} />
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          <Card variant="default" padding="lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-500" />
                  Community Food Ratings
                </CardTitle>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Current Meal Context */}
              {currentDate && currentMeal && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Rating for:</strong> {currentMeal} - {currentDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              )}

              {/* Food Items List */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
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
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-lg flex-shrink-0">
                          {getFoodEmoji(dish)}
                        </span>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                            {dish}
                          </span>
                          {communityRating && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                                ⭐ {communityRating.rating}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({communityRating.count} ratings)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-4">
                        {renderStars(dish)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredDishes.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No food items found matching "{searchTerm}"</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  🌟 Your ratings help the community! Ratings are shared with all users
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RateFoodModal;