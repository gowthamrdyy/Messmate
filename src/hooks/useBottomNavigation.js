import { useState, useCallback } from 'react';
import useAppStore from '../store/useAppStore';

/**
 * Hook for managing bottom navigation state and section switching
 * @param {string} initialSection - Initial active section
 * @returns {Object} Navigation state and handlers
 */
export const useBottomNavigation = (initialSection = 'home') => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [previousSection, setPreviousSection] = useState(null);
  
  const { 
    setCompactMode, 
    setShowWeeklyView,
    favorites,
    notificationsEnabled 
  } = useAppStore();

  // Handle section navigation
  const navigateToSection = useCallback((sectionId) => {
    setPreviousSection(activeSection);
    setActiveSection(sectionId);

    // Handle section-specific logic
    switch (sectionId) {
      case 'home':
        // Reset to normal meal view
        setCompactMode(false);
        setShowWeeklyView(false);
        break;
      
      case 'calendar':
        // Show weekly calendar view
        setShowWeeklyView(true);
        setCompactMode(false);
        break;
      
      case 'favorites':
        // Show favorites view (could be implemented as a filter)
        setCompactMode(true); // Show compact view for favorites
        setShowWeeklyView(false);
        break;
      
      case 'settings':
        // Settings section - no specific state changes needed
        setCompactMode(false);
        setShowWeeklyView(false);
        break;
      
      default:
        break;
    }
  }, [activeSection, setCompactMode, setShowWeeklyView]);

  // Go back to previous section
  const goBack = useCallback(() => {
    if (previousSection) {
      navigateToSection(previousSection);
    } else {
      navigateToSection('home');
    }
  }, [previousSection, navigateToSection]);

  // Get badge count for a section
  const getBadgeCount = useCallback((sectionId) => {
    switch (sectionId) {
      case 'favorites':
        return favorites.length > 0 ? favorites.length : null;
      
      case 'settings':
        return notificationsEnabled ? null : '!';
      
      default:
        return null;
    }
  }, [favorites.length, notificationsEnabled]);

  // Check if a section is available/enabled
  const isSectionEnabled = useCallback((sectionId) => {
    switch (sectionId) {
      case 'favorites':
        return favorites.length > 0;
      
      default:
        return true;
    }
  }, [favorites.length]);

  return {
    activeSection,
    previousSection,
    navigateToSection,
    goBack,
    getBadgeCount,
    isSectionEnabled,
  };
};

/**
 * Hook for managing section content visibility
 * @param {string} activeSection - Currently active section
 * @returns {Object} Section visibility states
 */
export const useSectionVisibility = (activeSection) => {
  return {
    showHome: activeSection === 'home',
    showCalendar: activeSection === 'calendar',
    showFavorites: activeSection === 'favorites',
    showSettings: activeSection === 'settings',
  };
};

export default useBottomNavigation;