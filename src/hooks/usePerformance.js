import { useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for memoizing expensive calculations
 * @param {Function} factory - The calculation function
 * @param {Array} deps - Dependencies array
 * @returns {any} Memoized result
 */
export const useExpensiveCalculation = (factory, deps) => {
  return useMemo(factory, deps);
};

/**
 * Hook for debouncing expensive operations
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook for throttling expensive operations
 * @param {Function} callback - The function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export const useThrottle = (callback, delay) => {
  const lastCallRef = useRef(0);
  const lastCallTimerRef = useRef(null);

  const throttledCallback = useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      callback(...args);
      lastCallRef.current = now;
    } else {
      if (lastCallTimerRef.current) {
        clearTimeout(lastCallTimerRef.current);
      }
      
      lastCallTimerRef.current = setTimeout(() => {
        callback(...args);
        lastCallRef.current = Date.now();
      }, delay - (now - lastCallRef.current));
    }
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (lastCallTimerRef.current) {
        clearTimeout(lastCallTimerRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

/**
 * Hook for memoizing filtered/sorted arrays
 * @param {Array} items - Array to process
 * @param {Function} filterFn - Filter function
 * @param {Function} sortFn - Sort function
 * @param {Array} deps - Additional dependencies
 * @returns {Array} Processed array
 */
export const useProcessedArray = (items, filterFn, sortFn, deps = []) => {
  return useMemo(() => {
    let processed = items;
    
    if (filterFn) {
      processed = processed.filter(filterFn);
    }
    
    if (sortFn) {
      processed = processed.sort(sortFn);
    }
    
    return processed;
  }, [items, filterFn, sortFn, ...deps]);
};

/**
 * Hook for tracking component render performance
 * @param {string} componentName - Name of the component
 * @param {Array} deps - Dependencies to track
 */
export const useRenderTracking = (componentName, deps = []) => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`[${componentName}] Render #${renderCountRef.current} (${timeSinceLastRender}ms since last render)`);
    }
  }, deps);

  return {
    renderCount: renderCountRef.current,
    timeSinceLastRender: Date.now() - lastRenderTimeRef.current,
  };
};

/**
 * Hook for optimizing list rendering with virtualization hints
 * @param {Array} items - List items
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @returns {Object} Virtualization data
 */
export const useVirtualizationHints = (items, itemHeight, containerHeight) => {
  return useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const visibleItems = Math.ceil(containerHeight / itemHeight) + 2; // Buffer of 2 items
    
    return {
      totalHeight,
      visibleItems: Math.min(visibleItems, items.length),
      shouldVirtualize: totalHeight > containerHeight * 2,
      itemHeight,
    };
  }, [items.length, itemHeight, containerHeight]);
};

export default {
  useExpensiveCalculation,
  useDebounce,
  useThrottle,
  useProcessedArray,
  useRenderTracking,
  useVirtualizationHints,
};
