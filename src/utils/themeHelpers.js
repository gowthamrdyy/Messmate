import { THEMES } from './constants';

/**
 * Get theme-aware class names
 * @param {string} theme - Current theme
 * @param {string} lightClass - Class for light theme
 * @param {string} darkClass - Class for dark theme
 * @returns {string} - Appropriate class name
 */
export const getThemeClass = (theme, lightClass, darkClass) => {
  return theme === THEMES.DARK ? darkClass : lightClass;
};

/**
 * Get theme-aware values
 * @param {string} theme - Current theme
 * @param {any} lightValue - Value for light theme
 * @param {any} darkValue - Value for dark theme
 * @returns {any} - Appropriate value
 */
export const getThemeValue = (theme, lightValue, darkValue) => {
  return theme === THEMES.DARK ? darkValue : lightValue;
};

/**
 * Generate glassmorphism classes based on theme
 * @param {string} theme - Current theme
 * @param {object} options - Customization options
 * @returns {string} - Glassmorphism classes
 */
export const getGlassmorphismClasses = (theme, options = {}) => {
  const {
    blur = 'backdrop-blur-lg',
    border = true,
    shadow = true,
    rounded = 'rounded-2xl',
  } = options;

  const baseClasses = ['glass', blur, rounded];
  
  if (border) {
    baseClasses.push('border');
    baseClasses.push(getThemeClass(theme, 'border-white/20', 'border-white/10'));
  }
  
  if (shadow) {
    baseClasses.push(getThemeClass(theme, 'shadow-glass', 'shadow-glass-dark'));
  }
  
  return baseClasses.join(' ');
};

/**
 * Get gradient background classes based on theme
 * @param {string} theme - Current theme
 * @param {string} type - Gradient type ('primary' | 'secondary')
 * @returns {string} - Gradient classes
 */
export const getGradientClasses = (theme, type = 'primary') => {
  if (theme === THEMES.DARK) {
    return type === 'primary' ? 'bg-gradient-dark' : 'bg-gradient-dark-alt';
  }
  return type === 'primary' ? 'bg-gradient-light' : 'bg-gradient-secondary';
};

/**
 * Get text color classes based on theme
 * @param {string} theme - Current theme
 * @param {string} variant - Text variant ('primary' | 'secondary' | 'muted')
 * @returns {string} - Text color classes
 */
export const getTextClasses = (theme, variant = 'primary') => {
  const variants = {
    primary: getThemeClass(theme, 'text-gray-900', 'text-gray-100'),
    secondary: getThemeClass(theme, 'text-gray-700', 'text-gray-300'),
    muted: getThemeClass(theme, 'text-gray-500', 'text-gray-400'),
  };
  
  return variants[variant] || variants.primary;
};

/**
 * Check if current theme is dark
 * @param {string} theme - Current theme
 * @returns {boolean} - True if dark theme
 */
export const isDarkTheme = (theme) => theme === THEMES.DARK;

/**
 * Check if current theme is light
 * @param {string} theme - Current theme
 * @returns {boolean} - True if light theme
 */
export const isLightTheme = (theme) => theme === THEMES.LIGHT;