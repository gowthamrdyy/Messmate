import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Fire, Star, Users } from 'lucide-react';
import { Card, CardContent } from './Card';
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
        <Card variant="default" padding="sm" className="bg-surface-100 dark:bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-surface-200 dark:bg-white/10 rounded-md animate-pulse" />
              <div className="w-32 h-5 bg-surface-200 dark:bg-white/10 rounded-md animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-surface-200 dark:bg-white/10 rounded-full animate-pulse" />
                  <div className="flex-1 h-4 bg-surface-200 dark:bg-white/10 rounded-md animate-pulse" />
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
        <Card variant="default" padding="sm" className="bg-surface-100 dark:bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-nebula-secondary" />
              <span className="text-sm font-bold text-text-primary">
                Popular Dishes
              </span>
            </div>
            <p className="text-xs text-text-secondary text-center py-2">
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
      <div className="card-glass p-4 bg-gradient-to-br from-nebula-secondary/10 to-transparent border-nebula-secondary/20">
        <div className="flex items-center gap-2 mb-4">
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
            className="p-1.5 bg-nebula-secondary/20 rounded-lg"
          >
            <Fire className="w-4 h-4 text-nebula-secondary" />
          </motion.div>
          <span className="text-sm font-bold text-text-primary">
            Trending Now
          </span>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-100 dark:bg-white/5 border border-white/10">
            <Users size={10} className="text-nebula-secondary" />
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Community Picks</span>
          </div>
        </div>

        <div className="space-y-2">
          {popularDishes.map((dish, index) => (
            <motion.div
              key={dish.dishName}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-100/50 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {getFoodEmoji(dish.dishName)}
                </span>
                <span className="font-medium text-sm text-text-primary truncate group-hover:text-nebula-secondary transition-colors">
                  {formatDishName(dish.dishName)}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs font-medium text-nebula-secondary bg-nebula-secondary/10 px-2 py-1 rounded-lg">
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
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current drop-shadow-sm" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[10px] font-medium text-text-tertiary text-center uppercase tracking-wider">
            Based on community ratings
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PopularDishes;