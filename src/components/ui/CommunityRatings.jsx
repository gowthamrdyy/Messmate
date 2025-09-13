import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Users, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import communityService from '../../services/communityService';
import useAppStore from '../../store/useAppStore';

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
          whileHover={interactive ? { scale: 1.1 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={interactive ? () => handleRate(starValue) : undefined}
          disabled={!interactive || isRating}
          className={`
            ${interactive ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'}
            ${isFilled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
            transition-colors duration-200
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
      <Card variant="default" padding="sm" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Community Rating
              </span>
            </div>
            
            {rating.count > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <TrendingUp size={12} />
                <span>{rating.count} rating{rating.count !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Current Rating Display */}
          {rating.count > 0 ? (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {renderStars(rating.average)}
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {rating.average}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({rating.count})
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              No ratings yet. Be the first to rate!
            </p>
          )}

          {/* User Rating Interface */}
          <div className="border-t border-blue-200 dark:border-blue-800 pt-3">
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
              Rate this dish:
            </p>
            <div className="flex items-center gap-1">
              {renderStars(userRating, true)}
            </div>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <p className="text-xs text-green-800 dark:text-green-200 text-center">
                  ✨ Thanks for rating! Your feedback helps the community.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isRating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-center"
            >
              <div className="inline-flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full"
                />
                Saving rating...
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommunityRatings;