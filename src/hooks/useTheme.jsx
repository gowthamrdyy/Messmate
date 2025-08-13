import { useEffect, createContext, useContext } from 'react';
import useAppStore from '../store/useAppStore';
import { THEMES } from '../utils/constants';

// Theme Context
const ThemeContext = createContext({
  theme: THEMES.LIGHT,
  toggleTheme: () => {},
  setTheme: () => {},
  systemPreference: THEMES.LIGHT,
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const {
    theme,
    systemPreference,
    setTheme,
    toggleTheme,
    initialize,
  } = useAppStore();

  // Initialize store on mount
  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  const value = {
    theme,
    toggleTheme,
    setTheme,
    systemPreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for theme-aware styles
export const useThemeStyles = () => {
  const { theme } = useTheme();
  
  const getThemeClass = (lightClass, darkClass) => {
    return theme === THEMES.DARK ? darkClass : lightClass;
  };

  const getThemeValue = (lightValue, darkValue) => {
    return theme === THEMES.DARK ? darkValue : lightValue;
  };

  return {
    theme,
    getThemeClass,
    getThemeValue,
    isDark: theme === THEMES.DARK,
    isLight: theme === THEMES.LIGHT,
  };
};