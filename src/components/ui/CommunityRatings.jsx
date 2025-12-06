import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from './Card';
import communityService from '../../services/communityService';

const CommunityRatings = ({ dishName, mess, className = '' }) => {
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (dishName) {
      loadRating();
    }
  }, [dishName, mess]);

  const loadRating = async () => {
    const ratingData = await communityService.getDishRating(dishName, mess);
    setRating(ratingData);
  };

  const handleRate = async (newRating) => {
    if (isRating) return;

    setIsRating(true);
    setUserRating(newRating);

    try {
      const result = await communityService.rateDish(dishName, newRating, 'user', mess);

      if (result.success) {
        setShowSuccess(true);
        await loadRating(); // Refresh rating

        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error rating dish:', error);
    }

    setIsRating(false);
  };

  const renderStars = (currentRating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= currentRating;

      return (
        <motion.button
          key={index}
          whileHover={interactive ? { scale: 1.2 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={interactive ? () => handleRate(starValue) : undefined}
          disabled={!interactive || isRating}
          className={`
            ${interactive ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'}
            ${isFilled ? 'text-yellow-400' : 'text-surface-300 dark:text-white/20'}
            transition-colors duration-200 p-0.5
          `}
        >
          <Star
            size={interactive ? 20 : 16}
            className={isFilled ? 'fill-current' : ''}
          />
        </motion.button>
      );
    });
  };

  if (!dishName) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div className="card-glass p-4 bg-gradient-to-br from-nebula-primary/10 to-transparent border-nebula-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-nebula-primary/10 rounded-lg">
              <Users className="w-4 h-4 text-nebula-primary" />
            </div>
            <span className="text-sm font-bold text-text-primary">
              Community Rating
            </span>
          </div>

          {rating.count > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-100 dark:bg-white/5 border border-white/10">
              <TrendingUp size={12} className="text-nebula-primary" />
              <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                {rating.count} rating{rating.count !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Current Rating Display */}
        {rating.count > 0 ? (
          <div className="flex items-center gap-3 mb-4 p-3 bg-surface-100/50 dark:bg-white/5 rounded-xl">
            <div className="flex items-center">
              {renderStars(rating.average)}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-text-primary">
                {rating.average}
              </span>
              <span className="text-xs text-text-tertiary">
                / 5
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-text-secondary mb-4 text-center italic">
            No ratings yet. Be the first to rate!
          </p>
        )}

        {/* User Rating Interface */}
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
            Rate this dish
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {renderStars(userRating, true)}
            </div>

            {/* Loading State */}
            {isRating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 border-2 border-nebula-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-text-tertiary">Saving...</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="p-2.5 bg-nebula-success/10 border border-nebula-success/20 rounded-xl">
                <p className="text-xs font-medium text-nebula-success text-center flex items-center justify-center gap-1.5">
                  <span>✨</span> Thanks for rating!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CommunityRatings;