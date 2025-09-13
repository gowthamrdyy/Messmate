import { motion } from 'framer-motion';
import { memo } from 'react';
import { Building2, Home } from 'lucide-react';
import Glass from './Glass';

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
      color: 'blue'
    },
    { 
      key: 'mblock', 
      label: 'M-Block', 
      subtitle: 'Girls Hostel',
      icon: Home,
      color: 'pink'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex justify-center items-center ${className}`}
    >
      <Glass
        variant="subtle"
        rounded="2xl"
        className="p-1 inline-flex"
      >
        {messOptions.map((option) => {
          const isSelected = selectedMess === option.key;
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.key}
              onClick={() => onMessChange(option.key)}
              className={`
                relative flex items-center space-x-1.5 px-3 py-2 rounded-lg
                font-medium text-xs transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isSelected 
                  ? 'text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {/* Background for selected state */}
              {isSelected && (
                <motion.div
                  layoutId="selectedBackground"
                  className={`
                    absolute inset-0 rounded-lg
                    ${option.color === 'blue' 
                      ? 'bg-blue-500 dark:bg-blue-600' 
                      : 'bg-pink-500 dark:bg-pink-600'
                    }
                  `}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              
              {/* Content */}
              <div className="relative flex items-center space-x-1.5">
                <Icon 
                  size={16} 
                  className={isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                />
                <span className="font-semibold">{option.label}</span>
              </div>
            </motion.button>
          );
        })}
      </Glass>
    </motion.div>
  );
});

BlockSelector.displayName = 'BlockSelector';

export default BlockSelector;