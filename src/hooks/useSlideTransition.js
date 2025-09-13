import { useState, useEffect } from 'react';

/**
 * Hook for managing slide transitions between content
 * @param {any} key - Key that changes when content should transition
 * @param {number} duration - Transition duration in milliseconds
 * @returns {Object} - Transition state and handlers
 */
export const useSlideTransition = (key, duration = 300) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(0);
  const [previousKey, setPreviousKey] = useState(key);

  useEffect(() => {
    if (key !== previousKey) {
      setIsTransitioning(true);
      
      // Determine direction based on key comparison
      // This is a simple heuristic - you might want to customize this
      const newDirection = key > previousKey ? 1 : -1;
      setDirection(newDirection);
      
      // Reset transition state after duration
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPreviousKey(key);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [key, previousKey, duration]);

  return {
    isTransitioning,
    direction,
    previousKey,
  };
};

/**
 * Hook for meal navigation slide transitions
 * @param {Object} mealNavigation - Current meal navigation state
 * @returns {Object} - Meal-specific transition state
 */
export const useMealSlideTransition = (mealNavigation) => {
  const [previousNavigation, setPreviousNavigation] = useState(mealNavigation);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (
      mealNavigation.dayOffset !== previousNavigation.dayOffset ||
      mealNavigation.mealIndex !== previousNavigation.mealIndex
    ) {
      setIsSliding(true);
      
      // Determine slide direction
      let direction = 0;
      
      if (mealNavigation.dayOffset !== previousNavigation.dayOffset) {
        direction = mealNavigation.dayOffset > previousNavigation.dayOffset ? 1 : -1;
      } else if (mealNavigation.mealIndex !== previousNavigation.mealIndex) {
        direction = mealNavigation.mealIndex > previousNavigation.mealIndex ? 1 : -1;
      }
      
      setSlideDirection(direction);
      
      // Reset after animation
      const timer = setTimeout(() => {
        setIsSliding(false);
        setPreviousNavigation(mealNavigation);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [mealNavigation, previousNavigation]);

  return {
    isSliding,
    slideDirection,
    previousNavigation,
  };
};

/**
 * Animation variants for slide transitions
 */
export const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

/**
 * Animation variants for fade slide transitions
 */
export const fadeSlideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
};