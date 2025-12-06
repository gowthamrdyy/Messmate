import { motion } from 'framer-motion';
import { memo } from 'react';
import { Building2, Home } from 'lucide-react';

const BlockSelector = memo(({
  selectedMess,
  onMessChange,
  className = ''
}) => {
  const messOptions = [
    {
      key: 'sannasi',
      label: 'Sannasi',
      subtitle: 'Boys Hostel',
      icon: Building2,
      color: 'bg-nebula-primary'
    },
    {
      key: 'mblock',
      label: 'M-Block',
      subtitle: 'Girls Hostel',
      icon: Home,
      color: 'bg-nebula-secondary'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex justify-center items-center ${className}`}
    >
      <div className="bg-surface-100 dark:bg-white/5 p-1.5 rounded-2xl shadow-sm border border-white/20 dark:border-white/10 inline-flex gap-1">
        {messOptions.map((option) => {
          const isSelected = selectedMess === option.key;
          const Icon = option.icon;

          return (
            <button
              key={option.key}
              onClick={() => onMessChange(option.key)}
              className="relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none"
            >
              {isSelected && (
                <motion.div
                  layoutId="blockSelector"
                  className={`absolute inset-0 rounded-xl ${option.color} shadow-lg shadow-nebula-primary/20`}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <div className="relative flex items-center gap-2">
                <Icon
                  size={16}
                  className={`transition-colors duration-300 ${isSelected ? 'text-white' : 'text-text-tertiary'}`}
                />
                <span className={`transition-colors duration-300 ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
});

BlockSelector.displayName = 'BlockSelector';

export default BlockSelector;