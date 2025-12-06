import { motion } from 'framer-motion';
import { Grid3X3, List } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const CompactModeToggle = ({ className = '' }) => {
  const { compactMode, toggleCompactMode } = useAppStore();

  return (
    <motion.button
      onClick={toggleCompactMode}
      className={`
        relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
        transition-all duration-300 focus:outline-none
        ${compactMode
          ? 'bg-nebula-accent/10 text-nebula-accent border border-nebula-accent/20'
          : 'bg-surface-100 dark:bg-white/5 text-text-secondary border border-white/20 dark:border-white/10 hover:bg-surface-200 dark:hover:bg-white/10'
        }
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${compactMode ? 'normal' : 'compact'} mode`}
    >
      {compactMode ? (
        <List size={16} className="text-current" />
      ) : (
        <Grid3X3 size={16} className="text-current" />
      )}
      <span className="hidden sm:inline">
        {compactMode ? 'List View' : 'Card View'}
      </span>
    </motion.button>
  );
};

export default CompactModeToggle;
