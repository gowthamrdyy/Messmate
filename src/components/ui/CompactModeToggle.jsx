import { motion } from 'framer-motion';
import { Grid3X3, List } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const CompactModeToggle = ({ className = '' }) => {
  const { compactMode, toggleCompactMode } = useAppStore();

  return (
    <motion.button
      onClick={toggleCompactMode}
      className={`
        relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${compactMode 
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${compactMode ? 'normal' : 'compact'} mode`}
    >
      {compactMode ? (
        <List size={12} className="text-blue-600 dark:text-blue-300" style={{ display: 'inline-block' }} />
      ) : (
        <Grid3X3 size={12} className="text-gray-700 dark:text-gray-300" style={{ display: 'inline-block' }} />
      )}
      <span className="text-xs font-medium">
        {compactMode ? 'Normal' : 'Compact'}
      </span>
    </motion.button>
  );
};

export default CompactModeToggle;
