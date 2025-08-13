import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { THEMES } from '../../utils/constants';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEMES.DARK;

  // Manual HTML icons as fallbacks
  const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  );

  const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  );

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center justify-center
        w-10 h-10 rounded-full
        bg-white dark:bg-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-600
        border border-gray-200 dark:border-gray-600
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Sun size={18} className="text-yellow-500" style={{ display: 'inline-block' }} />
          <SunIcon />
        </>
      ) : (
        <>
          <Moon size={18} className="text-gray-700 dark:text-gray-300" style={{ display: 'inline-block' }} />
          <MoonIcon />
        </>
      )}
    </button>
  );
};

export default ThemeToggle;