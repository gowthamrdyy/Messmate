import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing loading states with automatic timeout
 * @param {number} minLoadingTime - Minimum loading time in ms
 * @param {number} maxLoadingTime - Maximum loading time in ms (timeout)
 * @returns {Object} Loading state management functions
 */
export const useLoadingState = (minLoadingTime = 500, maxLoadingTime = 10000) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  const startLoading = useCallback((message = 'Loading...') => {
    setIsLoading(true);
    setLoadingMessage(message);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
  }, []);

  const setLoadingError = useCallback((errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  // Auto-timeout for loading states
  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => {
      setLoadingError('Loading timed out. Please try again.');
    }, maxLoadingTime);

    return () => clearTimeout(timeout);
  }, [isLoading, maxLoadingTime, setLoadingError]);

  return {
    isLoading,
    loadingMessage,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
  };
};

/**
 * Hook for managing async operations with loading states
 * @param {Function} asyncFunction - The async function to execute
 * @param {Object} options - Configuration options
 * @returns {Object} Async operation state and execute function
 */
export const useAsyncOperation = (asyncFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    loadingMessage = 'Processing...',
    minLoadingTime = 300,
  } = options;

  const { isLoading, error, startLoading, stopLoading, setLoadingError } = useLoadingState();
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      startLoading(loadingMessage);
      const startTime = Date.now();
      
      const result = await asyncFunction(...args);
      
      // Ensure minimum loading time for better UX
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      setData(result);
      stopLoading();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setLoadingError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    }
  }, [asyncFunction, startLoading, stopLoading, setLoadingError, onSuccess, onError, loadingMessage, minLoadingTime]);

  const reset = useCallback(() => {
    setData(null);
    stopLoading();
  }, [stopLoading]);

  return {
    execute,
    reset,
    isLoading,
    error,
    data,
  };
};

/**
 * Hook for managing component mount animations
 * @param {number} delay - Delay before showing content
 * @returns {boolean} Whether component should be visible
 */
export const useMountAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

/**
 * Hook for managing staggered animations
 * @param {number} itemCount - Number of items to animate
 * @param {number} staggerDelay - Delay between each item
 * @param {number} initialDelay - Initial delay before starting
 * @returns {Array} Array of visibility states for each item
 */
export const useStaggeredAnimation = (itemCount, staggerDelay = 100, initialDelay = 0) => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const timers = [];
    
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, initialDelay + (i * staggerDelay));
      
      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [itemCount, staggerDelay, initialDelay]);

  return visibleItems;
};

export default useLoadingState;