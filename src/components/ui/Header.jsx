import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { formatCurrentTime } from '../../utils/dateHelpers';
import { APP_CONFIG } from '../../utils/constants';

const Header = ({ currentTime, className = '' }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 ${className}`}
      role="banner"
    >
      <div className="absolute inset-0 bg-surface-100/70 dark:bg-nebula-dark/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm" />

      <div className="relative flex items-center justify-between w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        {/* Left spacer for balance */}
        <div className="flex-1" />

        {/* Center content */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl animate-float" role="img" aria-label="Logo">🍽️</span>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-nebula-primary to-nebula-accent tracking-tight">
              {APP_CONFIG.name}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <p className="text-sm text-text-secondary font-medium hidden md:block">
              {APP_CONFIG.description}
            </p>
            <span className="hidden md:block text-text-tertiary">•</span>
            <time
              className="text-sm font-mono font-medium text-text-primary bg-surface-200/50 dark:bg-white/5 px-2 py-0.5 rounded-md"
              dateTime={currentTime.toISOString()}
            >
              {formatCurrentTime(currentTime)}
            </time>
          </motion.div>
        </div>

        {/* Right side - Controls */}
        <div className="flex-1 flex justify-end items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;