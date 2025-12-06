import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Star, MessageCircle, Heart, Eye, Clock } from 'lucide-react';
import { Card, CardContent } from './Card';
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
        return <Star className="w-3 h-3 text-yellow-400 fill-current" />;
      case 'review':
        return <MessageCircle className="w-3 h-3 text-nebula-primary" />;
      case 'favorite':
        return <Heart className="w-3 h-3 text-nebula-error fill-current" />;
      case 'availability':
        return <Eye className="w-3 h-3 text-nebula-success" />;
      default:
        return <Activity className="w-3 h-3 text-text-tertiary" />;
    }
  };

  const getActivityText = (activity) => {
    const dishName = formatDishName(activity.dishName);

    switch (activity.type) {
      case 'rating':
        return (
          <span>
            Someone rated <strong className="text-text-primary">{dishName}</strong> {activity.rating}★
          </span>
        );
      case 'review':
        return (
          <span>
            Someone reviewed <strong className="text-text-primary">{dishName}</strong> ({activity.rating}★)
          </span>
        );
      case 'favorite':
        return (
          <span>
            Someone added <strong className="text-text-primary">{dishName}</strong> to favorites
          </span>
        );
      case 'availability':
        return (
          <span>
            <strong className="text-text-primary">{dishName}</strong> is {activity.isAvailable ? 'available' : 'unavailable'}
          </span>
        );
      default:
        return (
          <span>
            Activity on <strong className="text-text-primary">{dishName}</strong>
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
        <Card variant="default" padding="sm" className="bg-surface-100 dark:bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-surface-200 dark:bg-white/10 rounded-md animate-pulse" />
              <div className="w-24 h-5 bg-surface-200 dark:bg-white/10 rounded-md animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-surface-200 dark:bg-white/10 rounded-full animate-pulse" />
                  <div className="flex-1 h-3 bg-surface-200 dark:bg-white/10 rounded-md animate-pulse" />
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
        <Card variant="default" padding="sm" className="bg-surface-100 dark:bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-nebula-success" />
              <span className="text-sm font-bold text-text-primary">
                Live Activity
              </span>
            </div>
            <p className="text-xs text-text-secondary text-center py-2">
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
      <div className="card-glass p-4 bg-gradient-to-br from-nebula-success/10 to-transparent border-nebula-success/20">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="p-1.5 bg-nebula-success/20 rounded-lg"
          >
            <Activity className="w-4 h-4 text-nebula-success" />
          </motion.div>
          <span className="text-sm font-bold text-text-primary">
            Live Activity
          </span>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-100 dark:bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 bg-nebula-success rounded-full animate-pulse" />
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Live</span>
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
                className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-100/50 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                  <span className="text-sm">
                    {getFoodEmoji(activity.dishName)}
                  </span>
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {getActivityText(activity)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={8} className="text-text-tertiary" />
                    <span className="text-[10px] text-text-tertiary font-medium">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[10px] font-medium text-text-tertiary text-center uppercase tracking-wider">
            Real-time community activity
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveActivityFeed;