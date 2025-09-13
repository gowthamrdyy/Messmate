import { useState, useEffect } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * @returns {boolean} Whether user prefers reduced motion
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is supported
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to get animation config based on reduced motion preference
 * @param {Object} normalConfig - Normal animation configuration
 * @param {Object} reducedConfig - Reduced motion configuration
 * @returns {Object} Animation configuration
 */
export const useAnimationConfig = (normalConfig, reducedConfig = {}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      duration: 0.1,
      ease: 'linear',
      ...reducedConfig,
    };
  }

  return normalConfig;
};

/**
 * Hook to conditionally apply animations based on reduced motion preference
 * @param {Object} animations - Animation variants
 * @returns {Object} Conditional animation variants
 */
export const useConditionalAnimation = (animations) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    // Return simplified animations for reduced motion
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    };
  }

  return animations;
};

/**
 * Hook to get spring animation config with reduced motion support
 * @param {Object} springConfig - Spring animation configuration
 * @returns {Object} Spring configuration or linear fallback
 */
export const useSpringConfig = (springConfig = {}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      type: 'tween',
      duration: 0.1,
      ease: 'linear',
    };
  }

  return {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    ...springConfig,
  };
};

export default useReducedMotion;