import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import Glass from './Glass';
import { formatCurrentTime } from '../../utils/dateHelpers';
import { APP_CONFIG } from '../../utils/constants';

const Header = ({ currentTime, className = '' }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 ${className}`}
      role="banner"
      aria-label="Application header"
    >
      <Glass
        variant="light"
        blur="xl"
        className="border-b border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex items-center justify-between w-full max-w-md mx-auto px-6 py-4">
          {/* Left spacer */}
          <div className="flex-1" />
          
          {/* Center content */}
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl" role="img" aria-label="Food emoji">🍽️</span>
              <h1 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white tracking-tight text-render-optimized">
                {APP_CONFIG.name}
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-body-small text-gray-500 dark:text-gray-400 font-medium text-center"
              id="app-description"
            >
              {APP_CONFIG.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700"
              role="status"
              aria-live="polite"
              aria-label="Current time"
            >
              <time 
                className="text-mono text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 tabular-nums"
                dateTime={currentTime.toISOString()}
              >
                {formatCurrentTime(currentTime)}
              </time>
            </motion.div>
          </div>
          
          {/* Right side - Controls */}
          <div className="flex-1 flex justify-end items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </Glass>
    </motion.header>
  );
};

export default Header;