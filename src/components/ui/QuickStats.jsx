import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Calendar, Star } from 'lucide-react';
import { Card, CardContent } from './Card';
import useAppStore from '../../store/useAppStore';

const QuickStats = ({ menuData, selectedMess, className = '' }) => {
  const { favorites, ratings } = useAppStore();

  const stats = useMemo(() => {
    const messMenu = menuData[selectedMess] || {};
    
    // Count total items
    let totalItems = 0;
    let vegItems = 0;
    let nonVegItems = 0;
    const itemFrequency = {};
    
    Object.values(messMenu).forEach(meals => {
      Object.values(meals).forEach(items => {
        items.forEach(item => {
          totalItems++;
          
          // Count frequency
          const cleanItem = item.replace(/\*\*/g, '').toLowerCase();
          itemFrequency[cleanItem] = (itemFrequency[cleanItem] || 0) + 1;
          
          // Check if non-veg
          const nonVegKeywords = ['chicken', 'mutton', 'fish', 'egg', 'meat'];
          const isNonVeg = nonVegKeywords.some(keyword => 
            item.toLowerCase().includes(keyword)
          );
          
          if (isNonVeg) {
            nonVegItems++;
          } else {
            vegItems++;
          }
        });
      });
    });

    // Find most common item
    const mostCommon = Object.entries(itemFrequency)
      .sort(([,a], [,b]) => b - a)[0];

    // Calculate average rating
    const ratingValues = Object.values(ratings).filter(r => r > 0);
    const avgRating = ratingValues.length > 0 
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
      : 0;

    return {
      totalItems,
      vegItems,
      nonVegItems,
      favoritesCount: favorites.length,
      mostCommonItem: mostCommon ? mostCommon[0] : 'Rice',
      mostCommonCount: mostCommon ? mostCommon[1] : 0,
      avgRating: parseFloat(avgRating),
      ratedItems: ratingValues.length
    };
  }, [menuData, selectedMess, favorites, ratings]);

  const statCards = [
    {
      icon: Heart,
      label: 'Favorites',
      value: stats.favoritesCount,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Most Common',
      value: stats.mostCommonItem,
      subtitle: `${stats.mostCommonCount} times`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Calendar,
      label: 'Total Items',
      value: stats.totalItems,
      subtitle: `${stats.vegItems} veg, ${stats.nonVegItems} non-veg`,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Star,
      label: 'Avg Rating',
      value: stats.avgRating > 0 ? `${stats.avgRating}★` : 'No ratings',
      subtitle: stats.ratedItems > 0 ? `${stats.ratedItems} items rated` : '',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    }
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="default" padding="sm" className="h-full">
              <CardContent className="p-3">
                <div className={`flex items-center gap-2 mb-2 ${stat.bgColor} rounded-lg p-2`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickStats;