import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Star, MessageCircle, Heart, Eye, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { FOOD_EMOJIS } from '../../utils/constants';
import communityService from '../../services/communityService';

const LiveActivityFeed = ({ mess, className = '' }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, [mess]);

  const loadRecentActivity = async () => {
    setLoading(true);
    try {
      const activities = await communityService.getRecentActivity(mess, 8);
      setActivities(activities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    }
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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'rating':
        return <Star className="w-3 h-3 text-yellow-500" />;
      case 'review':
        return <MessageCircle className="w-3 h-3 text-blue-500" />;
      case 'favorite':
        return <Heart className="w-3 h-3 text-red-500" />;
      case 'availability':
        return <Eye className="w-3 h-3 text-green-500" />;
      default:
        return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const getActivityText = (activity) => {
    const dishName = formatDishName(activity.dishName);
    
    switch (activity.type) {
      case 'rating':
        return (
          <span>
            Someone rated <strong>{dishName}</strong> {activity.rating}★
          </span>
        );
      case 'review':
        return (
          <span>
            Someone reviewed <strong>{dishName}</strong> ({activity.rating}★)
          </span>
        );
      case 'favorite':
        return (
          <span>
            Someone added <strong>{dishName}</strong> to favorites
          </span>
        );
      case 'availability':
        return (
          <span>
            <strong>{dishName}</strong> is {activity.isAvailable ? 'available' : 'unavailable'}
          </span>
        );
      default:
        return (
          <span>
            Activity on <strong>{dishName}</strong>
          </span>
        );
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'Just now';
    
    const now = new Date();
    const activityTime = new Date(timestamp.seconds * 1000);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
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
              <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="flex-1 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        <Card variant="default" padding="sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Live Activity
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
              No recent activity. Be the first to rate or review!
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
      <Card variant="default" padding="sm" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
            </motion.div>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Live Activity
            </span>
            <div className="ml-auto flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
                >
                  <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                    <span className="text-sm">
                      {getFoodEmoji(activity.dishName)}
                    </span>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      {getActivityText(activity)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={8} className="text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {getTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-3 pt-2 border-t border-green-200 dark:border-green-800">
            <p className="text-xs text-green-700 dark:text-green-300 text-center">
              🔴 Real-time community activity
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LiveActivityFeed;