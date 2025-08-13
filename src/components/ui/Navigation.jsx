import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { useState } from 'react';
import Glass from './Glass';
import { ComponentLoadingState } from './LoadingState';
import { useAccessibility } from '../../hooks/useAccessibility';

const Navigation = memo(({
  meal,
  dayLabel,
  isLive,
  onPrevious,
  onNext,
  onGoLive,
  className = '',
  disabled = false,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isReducedMotion } = useAccessibility();

  // HTML/SVG Icons
  const ChevronLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  );

  const WifiIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12a10 10 0 0 1 20 0"></path>
      <path d="M5 12a7 7 0 0 1 14 0"></path>
      <path d="M8 12a4 4 0 0 1 8 0"></path>
      <circle cx="12" cy="12" r="1"></circle>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  );

  // Enhanced Go Live icon with pulsing animation
  const GoLiveIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
      <path d="M12 2v4"></path>
      <path d="M12 18v4"></path>
      <path d="M4.93 4.93l2.83 2.83"></path>
      <path d="M16.24 16.24l2.83 2.83"></path>
      <path d="M2 12h4"></path>
      <path d="M18 12h4"></path>
      <path d="M4.93 19.07l2.83-2.83"></path>
      <path d="M16.24 7.76l2.83-2.83"></path>
    </svg>
  );

  const handleNavigation = async (navigationFn, direction) => {
    if (disabled || isTransitioning) return;
    
    setIsTransitioning(true);
    navigationFn();
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  // Show loading state if no meal data
  if (!meal) {
    return (
      <div className={`flex justify-between items-center w-full ${className}`}>
        <ComponentLoadingState variant="dots" className="py-2" />
      </div>
    );
  }

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex justify-between items-center w-full ${className}`}
      role="navigation"
      aria-label="Meal navigation"
    >
      {/* Previous Button */}
      <motion.button
        variants={itemVariants}
        onClick={() => handleNavigation(onPrevious, -1)}
        disabled={disabled || isTransitioning}
        className={`
          group relative flex items-center justify-center w-12 h-12 rounded-full
          bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
          text-white shadow-md hover:shadow-lg
          transition-all duration-200 transform hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        `}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        aria-label="Go to previous meal"
        aria-describedby="meal-navigation-description"
      >
        <motion.div
          animate={{ x: isTransitioning ? -2 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          <ChevronLeftIcon />
        </motion.div>
      </motion.button>
      
      {/* Center Info */}
      <Glass
        variant="subtle"
        className="flex flex-col items-center space-y-2 px-8 py-4 mx-6 min-w-[220px]"
        rounded="2xl"
      >
        <AnimatePresence mode="wait">
          <motion.h2
            key={meal.name}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="font-display font-bold text-xl md:text-2xl lg:text-3xl text-gray-900 dark:text-white text-center tracking-tight"
            id="current-meal-title"
          >
            {meal.name}
          </motion.h2>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={dayLabel}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium text-center"
            id="current-day-label"
          >
            {dayLabel}
          </motion.p>
        </AnimatePresence>
        
        {/* Live indicator or Go Live button */}
        <AnimatePresence mode="wait">
          {isLive ? (
            <motion.div
              key="live-indicator"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg border border-white/20"
              role="status"
              aria-live="polite"
              aria-label="Currently viewing live meal"
            >
              <motion.div
                animate={{ 
                  scale: isReducedMotion ? 1 : [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 1.5, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                }}
                className="flex items-center justify-center"
              >
                <WifiIcon />
              </motion.div>
              <span className="text-sm font-bold tracking-wide">LIVE</span>
            </motion.div>
          ) : (
            <motion.button
              key="go-live-button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onClick={onGoLive}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full
                bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 
                hover:from-orange-600 hover:via-red-600 hover:to-pink-600
                text-white text-sm font-bold transition-all duration-300
                shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                border border-white/20
              `}
              whileTap={{ scale: 0.95 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              aria-label="Go to current live meal"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="flex items-center justify-center"
              >
                <ClockIcon />
              </motion.div>
              <span className="font-bold tracking-wide">GO LIVE</span>
            </motion.button>
          )}
        </AnimatePresence>
      </Glass>
      
      {/* Next Button */}
      <motion.button
        variants={itemVariants}
        onClick={() => handleNavigation(onNext, 1)}
        disabled={disabled || isTransitioning}
        className={`
          group relative flex items-center justify-center w-12 h-12 rounded-full
          bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
          text-white shadow-md hover:shadow-lg
          transition-all duration-200 transform hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        aria-label="Go to next meal"
        aria-describedby="meal-navigation-description"
      >
        <motion.div
          animate={{ x: isTransitioning ? 2 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          <ChevronRightIcon />
        </motion.div>
      </motion.button>
      
      {/* Hidden description for screen readers */}
      <div id="meal-navigation-description" className="sr-only">
        Navigate between different meals and days. Use the previous and next buttons to browse through the menu.
      </div>
    </motion.nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;