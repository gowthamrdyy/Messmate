import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Fire, Star, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { FOOD_EMOJIS } from '../../utils/constants';
import communityService from '../../services/communityService';

const PopularDishes = ({ mess, className = '' }) => {
  const [popularDishes, setPopularDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPopularDishes();
  }, [mess]);

  const loadPopularDishes = async () => {
    setLoading(true);
    const dishes = await communityService.getPopularDishes(mess, 5);
    setPopularDishes(dishes);
    setLoading(false);
  };

  const getFoodEmoji = (dishName) => {
    const cleanItem = dishName.toLowerCase().replace(/\*\*/g, '').trim();
    
    for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
      if (key !== 'default' && cleanItem.includes(key)) {
        return emoji;
      }
    }
    return FOOD_EMOJIS.default;
  };

  const formatDishName = (dishName) => {
    return dishName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        <Card variant="default" padding="sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="flex-1 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (popularDishes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        <Card variant="default" padding="sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Popular Dishes
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
              No community data yet. Start rating dishes to see popular items!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card variant="default" padding="sm" className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Fire className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </motion.div>
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Trending Now
            </span>
            <div className="ml-auto flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
              <Users size={10} />
              <span>Community Picks</span>
            </div>
          </div>

          <div className="space-y-2">
            {popularDishes.map((dish, index) => (
              <motion.div
                key={dish.dishName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">
                    {getFoodEmoji(dish.dishName)}
                  </span>
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                    {formatDishName(dish.dishName)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                    <TrendingUp size={10} />
                    <span>{dish.totalInteractions}</span>
                  </div>
                  
                  {index === 0 && (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-orange-200 dark:border-orange-800">
            <p className="text-xs text-orange-700 dark:text-orange-300 text-center">
              💡 Based on community ratings and interactions
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PopularDishes;