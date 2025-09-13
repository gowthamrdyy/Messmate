import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { FOOD_EMOJIS } from '../../utils/constants';

const QuickSearch = ({ menuData, selectedMess, onItemClick, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Get food emoji for item
  const getFoodEmoji = (item) => {
    const cleanItem = item.toLowerCase().replace(/\*\*/g, '').trim();
    
    for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
      if (key !== 'default' && cleanItem.includes(key)) {
        return emoji;
      }
    }
    return FOOD_EMOJIS.default;
  };

  // Search through all menu items
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results = [];
    const term = searchTerm.toLowerCase();
    
    Object.entries(menuData[selectedMess] || {}).forEach(([day, meals]) => {
      Object.entries(meals).forEach(([meal, items]) => {
        items.forEach(item => {
          if (item.toLowerCase().includes(term)) {
            results.push({
              item,
              day: day.charAt(0).toUpperCase() + day.slice(1),
              meal: meal.charAt(0).toUpperCase() + meal.slice(1),
              emoji: getFoodEmoji(item)
            });
          }
        });
      });
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchTerm, menuData, selectedMess]);

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            // Track search activity (temporarily disabled)
            // if (e.target.value.length > 2) {
            //   communityService.trackSearch(e.target.value, selectedMess);
            // }
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {searchResults.map((result, index) => (
              <motion.button
                key={`${result.item}-${result.day}-${result.meal}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  onItemClick?.(result);
                  handleClear();
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{result.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {result.item.replace(/\*\*/g, '')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {result.day} • {result.meal}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default QuickSearch;