import { motion } from 'framer-motion';
import { useMealSwipeNavigation } from '../../hooks/useSwipeGestures';
import SwipeIndicator from './SwipeIndicator';

const SwipeableContainer = ({
  children,
  onNext,
  onPrevious,
  className = '',
  disabled = false,
  ...props
}) => {
  const {
    swipeHandlers,
    isSwipeActive,
    swipeDirection,
    swipeProgress,
    feedbackVisible,
    feedbackDirection,
  } = useMealSwipeNavigation({
    onNext: disabled ? null : onNext,
    onPrevious: disabled ? null : onPrevious,
  });

  return (
    <motion.div
      {...swipeHandlers}
      className={`relative ${className}`}
      style={{ touchAction: 'pan-y' }} // Allow vertical scrolling
      {...props}
    >
      {/* Swipe feedback overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={{
          backgroundColor: isSwipeActive
            ? swipeDirection === 'left'
              ? `rgba(59, 130, 246, ${swipeProgress * 0.1})`
              : `rgba(147, 51, 234, ${swipeProgress * 0.1})`
            : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Content */}
      <motion.div
        animate={{
          x: isSwipeActive && swipeDirection
            ? swipeDirection === 'left'
              ? -swipeProgress * 20
              : swipeProgress * 20
            : 0,
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.div>

      {/* Swipe indicators */}
      <SwipeIndicator
        isActive={isSwipeActive}
        direction={swipeDirection}
        progress={swipeProgress}
      />

      {/* Success feedback */}
      {feedbackVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <div className={`
            px-6 py-3 rounded-2xl font-medium text-white
            ${feedbackDirection === 'left' 
              ? 'bg-blue-500' 
              : 'bg-purple-500'
            }
            shadow-lg backdrop-blur-lg
          `}>
            {feedbackDirection === 'left' ? 'Next Meal' : 'Previous Meal'}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwipeableContainer;