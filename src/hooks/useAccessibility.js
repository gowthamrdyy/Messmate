import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for managing accessibility features
 * @param {Object} options - Accessibility options
 * @returns {Object} Accessibility utilities
 */
export const useAccessibility = (options = {}) => {
  const {
    enableKeyboardNavigation = true,
    enableFocusManagement = true,
    enableScreenReaderSupport = true,
    enableReducedMotion = true,
  } = options;

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const focusableElementsRef = useRef([]);
  const currentFocusIndexRef = useRef(0);

  // Detect reduced motion preference
  useEffect(() => {
    if (!enableReducedMotion) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableReducedMotion]);

  // Detect keyboard user
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = () => {
      setIsKeyboardUser(true);
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    const handleTouchStart = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [enableKeyboardNavigation]);

  // Focus management
  const focusElement = useCallback((element) => {
    if (!enableFocusManagement || !element) return;

    try {
      element.focus();
      // Add focus indicator for keyboard users
      if (isKeyboardUser) {
        element.classList.add('focus-visible');
      }
    } catch (error) {
      console.warn('Failed to focus element:', error);
    }
  }, [enableFocusManagement, isKeyboardUser]);

  const focusFirstElement = useCallback(() => {
    if (!enableFocusManagement || focusableElementsRef.current.length === 0) return;

    const firstElement = focusableElementsRef.current[0];
    focusElement(firstElement);
    currentFocusIndexRef.current = 0;
  }, [enableFocusManagement, focusElement]);

  const focusLastElement = useCallback(() => {
    if (!enableFocusManagement || focusableElementsRef.current.length === 0) return;

    const lastIndex = focusableElementsRef.current.length - 1;
    const lastElement = focusableElementsRef.current[lastIndex];
    focusElement(lastElement);
    currentFocusIndexRef.current = lastIndex;
  }, [enableFocusManagement, focusElement]);

  const focusNextElement = useCallback(() => {
    if (!enableFocusManagement || focusableElementsRef.current.length === 0) return;

    const nextIndex = (currentFocusIndexRef.current + 1) % focusableElementsRef.current.length;
    const nextElement = focusableElementsRef.current[nextIndex];
    focusElement(nextElement);
    currentFocusIndexRef.current = nextIndex;
  }, [enableFocusManagement, focusElement]);

  const focusPreviousElement = useCallback(() => {
    if (!enableFocusManagement || focusableElementsRef.current.length === 0) return;

    const prevIndex = currentFocusIndexRef.current === 0 
      ? focusableElementsRef.current.length - 1 
      : currentFocusIndexRef.current - 1;
    const prevElement = focusableElementsRef.current[prevIndex];
    focusElement(prevElement);
    currentFocusIndexRef.current = prevIndex;
  }, [enableFocusManagement, focusElement]);

  // Register focusable elements
  const registerFocusableElement = useCallback((element) => {
    if (!enableFocusManagement || !element) return;

    if (!focusableElementsRef.current.includes(element)) {
      focusableElementsRef.current.push(element);
    }
  }, [enableFocusManagement]);

  const unregisterFocusableElement = useCallback((element) => {
    if (!enableFocusManagement || !element) return;

    const index = focusableElementsRef.current.indexOf(element);
    if (index > -1) {
      focusableElementsRef.current.splice(index, 1);
      if (currentFocusIndexRef.current >= focusableElementsRef.current.length) {
        currentFocusIndexRef.current = Math.max(0, focusableElementsRef.current.length - 1);
      }
    }
  }, [enableFocusManagement]);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message, priority = 'polite') => {
    if (!enableScreenReaderSupport) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }, [enableScreenReaderSupport]);

  // Keyboard navigation handler
  const handleKeyboardNavigation = useCallback((event, options = {}) => {
    if (!enableKeyboardNavigation) return;

    const {
      onEnter,
      onEscape,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      onTab,
      onSpace,
      preventDefault = true,
    } = options;

    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          onEnter(event);
          if (preventDefault) event.preventDefault();
        }
        break;
      case 'Escape':
        if (onEscape) {
          onEscape(event);
          if (preventDefault) event.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          onArrowUp(event);
          if (preventDefault) event.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          onArrowDown(event);
          if (preventDefault) event.preventDefault();
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          onArrowLeft(event);
          if (preventDefault) event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          onArrowRight(event);
          if (preventDefault) event.preventDefault();
        }
        break;
      case 'Tab':
        if (onTab) {
          onTab(event);
          if (preventDefault) event.preventDefault();
        }
        break;
      case ' ':
        if (onSpace) {
          onSpace(event);
          if (preventDefault) event.preventDefault();
        }
        break;
    }
  }, [enableKeyboardNavigation]);

  // ARIA utilities
  const getAriaLabel = useCallback((label, description) => {
    if (!enableScreenReaderSupport) return label;

    if (description) {
      return `${label}. ${description}`;
    }
    return label;
  }, [enableScreenReaderSupport]);

  const getAriaDescribedBy = useCallback((descriptionId) => {
    if (!enableScreenReaderSupport || !descriptionId) return undefined;
    return descriptionId;
  }, [enableScreenReaderSupport]);

  // Focus trap for modals/dialogs
  const createFocusTrap = useCallback((containerRef) => {
    if (!enableFocusManagement || !containerRef?.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [enableFocusManagement]);

  return {
    // State
    isReducedMotion,
    isKeyboardUser,
    
    // Focus management
    focusElement,
    focusFirstElement,
    focusLastElement,
    focusNextElement,
    focusPreviousElement,
    registerFocusableElement,
    unregisterFocusableElement,
    
    // Screen reader
    announceToScreenReader,
    
    // Keyboard navigation
    handleKeyboardNavigation,
    
    // ARIA utilities
    getAriaLabel,
    getAriaDescribedBy,
    
    // Focus trap
    createFocusTrap,
  };
};

/**
 * Hook for managing focus on mount
 * @param {boolean} shouldFocus - Whether to focus on mount
 * @param {string} focusSelector - CSS selector for focus target
 */
export const useFocusOnMount = (shouldFocus = false, focusSelector = null) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!shouldFocus) return;

    let targetElement = elementRef.current;
    
    if (focusSelector && !targetElement) {
      targetElement = document.querySelector(focusSelector);
    }

    if (targetElement) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        targetElement.focus();
      }, 0);
    }
  }, [shouldFocus, focusSelector]);

  return elementRef;
};

/**
 * Hook for managing skip links
 */
export const useSkipLinks = () => {
  const [skipLinks, setSkipLinks] = useState([]);

  const addSkipLink = useCallback((id, label, targetId) => {
    setSkipLinks(prev => [...prev, { id, label, targetId }]);
  }, []);

  const removeSkipLink = useCallback((id) => {
    setSkipLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  const handleSkipLinkClick = useCallback((targetId) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return {
    skipLinks,
    addSkipLink,
    removeSkipLink,
    handleSkipLinkClick,
  };
};

export default useAccessibility;
