import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Leaf, Drumstick } from 'lucide-react';

const DietaryFilter = ({ onFilterChange, className = '' }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    {
      id: 'all',
      label: 'All Items',
      icon: Filter,
      activeClass: 'bg-nebula-primary text-white shadow-lg shadow-nebula-primary/25 border-nebula-primary',
      inactiveClass: 'text-text-secondary hover:bg-surface-200 dark:hover:bg-white/5'
    },
    {
      id: 'veg',
      label: 'Vegetarian',
      icon: Leaf,
      activeClass: 'bg-nebula-success text-white shadow-lg shadow-nebula-success/25 border-nebula-success',
      inactiveClass: 'text-nebula-success hover:bg-nebula-success/10 border-nebula-success/20'
    },
    {
      id: 'non-veg',
      label: 'Non-Veg',
      icon: Drumstick,
      activeClass: 'bg-nebula-error text-white shadow-lg shadow-nebula-error/25 border-nebula-error',
      inactiveClass: 'text-nebula-error hover:bg-nebula-error/10 border-nebula-error/20'
    }
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
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border
              ${isActive ? filter.activeClass : `bg-surface-100 dark:bg-white/5 border-white/20 dark:border-white/10 ${filter.inactiveClass}`}
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