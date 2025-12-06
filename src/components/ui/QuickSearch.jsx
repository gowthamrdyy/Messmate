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
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-text-tertiary group-focus-within:text-nebula-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for dishes..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 bg-surface-100 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-nebula-primary/50 focus:border-transparent transition-all shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-text-tertiary hover:text-text-primary transition-colors" />
          </button>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-surface-100 dark:bg-nebula-dark border border-white/20 dark:border-white/10 rounded-2xl shadow-xl max-h-64 overflow-y-auto custom-scrollbar backdrop-blur-xl"
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
                className="w-full px-4 py-3 text-left hover:bg-surface-200 dark:hover:bg-white/5 border-b border-white/10 last:border-b-0 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">{result.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate group-hover:text-nebula-primary transition-colors">
                      {result.item.replace(/\*\*/g, '')}
                    </p>
                    <p className="text-xs text-text-tertiary">
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