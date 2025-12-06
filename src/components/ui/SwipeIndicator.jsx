import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SwipeIndicator = ({
  isActive = false,
  direction = null,
  progress = 0,
  className = '',
}) => {
  const getIndicatorContent = () => {
    switch (direction) {
      case 'left':
        return {
          icon: ChevronLeft,
          text: 'Next',
          position: 'right-4',
          color: 'text-blue-500',
        };
      case 'right':
        return {
          icon: ChevronRight,
          text: 'Previous',
          position: 'left-4',
          color: 'text-purple-500',
        };
      default:
        return null;
    }
  };

  const indicatorContent = getIndicatorContent();

  if (!indicatorContent || !isActive) return null;

  const { icon: Icon, text, position, color } = indicatorContent;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: Math.min(progress * 2, 1),
          scale: 0.8 + (progress * 0.4),
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`
          fixed top-1/2 transform -translate-y-1/2 z-50
          ${position} ${className}
        `}
      >
        <div className={`
          flex flex-col items-center space-y-2 p-4 rounded-2xl
          bg-white/90 dark:bg-black/90 backdrop-blur-lg
          border border-gray-200 dark:border-gray-700
          shadow-lg ${color}
        `}>
          <motion.div
            animate={{ 
              x: direction === 'left' ? -5 : 5,
              scale: 1 + (progress * 0.2),
            }}
            transition={{ 
              x: { repeat: Infinity, repeatType: 'reverse', duration: 0.8 },
              scale: { duration: 0.2 },
            }}
          >
            <Icon size={24} style={{ display: 'inline-block' }} />
          </motion.div>
          <span className="text-xs font-medium">{text}</span>
          
          {/* Progress bar */}
          <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                direction === 'left' ? 'bg-blue-500' : 'bg-purple-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeIndicator;