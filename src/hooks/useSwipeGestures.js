import { useSwipeable } from 'react-swipeable';
import { useState, useCallback } from 'react';

/**
 * Custom hook for swipe gesture navigation
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback for left swipe (next)
 * @param {Function} options.onSwipeRight - Callback for right swipe (previous)
 * @param {number} options.threshold - Minimum distance for swipe (default: 50)
 * @param {number} options.velocity - Minimum velocity for swipe (default: 0.3)
 * @param {boolean} options.preventDefaultTouchmoveEvent - Prevent default touch events
 * @returns {Object} - Swipe handlers and state
 */
export const useSwipeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  velocity = 0.3,
  preventDefaultTouchmoveEvent = false,
} = {}) => {
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const handleSwipeStart = useCallback(() => {
    setIsSwipeActive(true);
    setSwipeDirection(null);
    setSwipeProgress(0);
  }, []);

  const handleSwiping = useCallback((eventData) => {
    const { deltaX, absX } = eventData;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > 10) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    }
    
    // Calculate progress (0 to 1)
    const progress = Math.min(absX / threshold, 1);
    setSwipeProgress(progress);
  }, [threshold]);

  const handleSwipeEnd = useCallback(() => {
    setIsSwipeActive(false);
    setSwipeDirection(null);
    setSwipeProgress(0);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipeStart: handleSwipeStart,
    onSwiping: handleSwiping,
    onSwipedLeft: (eventData) => {
      handleSwipeEnd();
      if (eventData.absX >= threshold && Math.abs(eventData.velocity) >= velocity) {
        onSwipeLeft?.(eventData);
      }
    },
    onSwipedRight: (eventData) => {
      handleSwipeEnd();
      if (eventData.absX >= threshold && Math.abs(eventData.velocity) >= velocity) {
        onSwipeRight?.(eventData);
      }
    },
    onTouchEndOrOnMouseUp: handleSwipeEnd,
    delta: threshold,
    preventDefaultTouchmoveEvent,
    trackTouch: true,
    trackMouse: false, // Disable mouse tracking for better UX
    rotationAngle: 0,
  });

  return {
    swipeHandlers,
    isSwipeActive,
    swipeDirection,
    swipeProgress,
  };
};

/**
 * Hook for meal navigation swipes
 * @param {Object} navigation - Navigation functions
 * @param {Function} navigation.onNext - Next meal function
 * @param {Function} navigation.onPrevious - Previous meal function
 * @param {Object} options - Additional options
 * @returns {Object} - Swipe handlers and visual feedback state
 */
export const useMealSwipeNavigation = ({ onNext, onPrevious }, options = {}) => {
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackDirection, setFeedbackDirection] = useState(null);

  const showFeedback = useCallback((direction) => {
    setFeedbackDirection(direction);
    setFeedbackVisible(true);
    setTimeout(() => {
      setFeedbackVisible(false);
      setFeedbackDirection(null);
    }, 300);
  }, []);

  const {
    swipeHandlers,
    isSwipeActive,
    swipeDirection,
    swipeProgress,
  } = useSwipeGestures({
    onSwipeLeft: () => {
      showFeedback('left');
      onNext?.();
    },
    onSwipeRight: () => {
      showFeedback('right');
      onPrevious?.();
    },
    threshold: 80, // Slightly higher threshold for meal navigation
    velocity: 0.4,
    ...options,
  });

  return {
    swipeHandlers,
    isSwipeActive,
    swipeDirection,
    swipeProgress,
    feedbackVisible,
    feedbackDirection,
  };
};

/**
 * Hook for detecting swipe capability
 * @returns {boolean} - True if device supports touch
 */
export const useSwipeCapable = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};