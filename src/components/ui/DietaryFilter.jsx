import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Leaf, Drumstick } from 'lucide-react';

const DietaryFilter = ({ onFilterChange, className = '' }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Items', icon: Filter, color: 'gray' },
    { id: 'veg', label: 'Vegetarian', icon: Leaf, color: 'green' },
    { id: 'non-veg', label: 'Non-Veg', icon: Drumstick, color: 'red' }
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  const getFilterFunction = (filterId) => {
    switch (filterId) {
      case 'veg':
        return (item) => !isNonVegItem(item);
      case 'non-veg':
        return (item) => isNonVegItem(item);
      default:
        return () => true;
    }
  };

  const isNonVegItem = (item) => {
    const nonVegKeywords = [
      'chicken', 'mutton', 'fish', 'egg', 'meat', 'prawn', 'crab',
      'beef', 'pork', 'lamb', 'turkey', 'duck', 'seafood'
    ];
    
    const itemLower = item.toLowerCase();
    return nonVegKeywords.some(keyword => itemLower.includes(keyword));
  };

  // Expose filter function for parent component
  useEffect(() => {
    onFilterChange?.(getFilterFunction(activeFilter));
  }, [activeFilter, onFilterChange]);

  return (
    <div className={`flex gap-2 ${className}`}>
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        
        return (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilterChange(filter.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                ? `bg-${filter.color}-100 dark:bg-${filter.color}-900/30 text-${filter.color}-700 dark:text-${filter.color}-300 border-2 border-${filter.color}-300 dark:border-${filter.color}-700`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{filter.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default DietaryFilter;