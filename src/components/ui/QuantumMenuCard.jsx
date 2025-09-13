import { AnimatePresence } from 'framer-motion';
import { useState, memo, useMemo, useCallback } from 'react';
import { Heart, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { FOOD_EMOJIS } from '../../utils/constants';
import { hasSimilarFavorite, getMatchingFavorite } from '../../utils/itemMatching';
import useAppStore from '../../store/useAppStore';
import MenuCorrection from './MenuCorrection';

const QuantumMenuCard = memo(({ 
  meal, 
  menuItems = [], 
  dayLabel = '',
  currentDate,
  className = '',
  onPrevious,
  onNext,
  onGoLive,
  isLive = false,
  disabled = false,
  ...props 
}) => {
  const { favorites, toggleFavorite } = useAppStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentMenuItems, setCurrentMenuItems] = useState(menuItems);

  // Get food emoji with enhanced matching
  const getFoodEmoji = useCallback((item) => {
    const itemLower = item.toLowerCase().trim();
    const cleanItem = itemLower.replace(/\*\*/g, '').replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
    
    // Enhanced emoji matching with quantum effects
    for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
      if (key === 'default') continue;
      if (cleanItem.includes(key) || key.includes(cleanItem)) {
        return emoji;
      }
    }
    return FOOD_EMOJIS.default;
  }, []);

  // Update current menu items when props change
  useMemo(() => {
    setCurrentMenuItems(menuItems);
  }, [menuItems]);

  // Quantum menu item processing
  const quantumMenuItems = useMemo(() => {
    return currentMenuItems.map((item, index) => {
      const isFavorite = favorites.includes(item) || hasSimilarFavorite(item, favorites);
      const emoji = getFoodEmoji(item);
      
      return {
        id: `quantum-${index}`,
        name: item,
        emoji,
        isFavorite,
      };
    });
  }, [currentMenuItems, favorites, getFoodEmoji]);

  // Handle favorite toggle with quantum effects
  const handleQuantumToggle = useCallback((item) => {
    const matchingFavorite = getMatchingFavorite(item.name, favorites);
    const targetItem = matchingFavorite || item.name;
    toggleFavorite(targetItem);
  }, [favorites, toggleFavorite]);



  // Get formatted date for display
  const getFormattedDate = () => {
    const dateToShow = currentDate || new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return dateToShow.toLocaleDateString('en-US', options);
  };

  // Quantum Menu View (Only view)
  const QuantumMenuView = () => (
    <div className="quantum-menu space-y-2">
      {quantumMenuItems.map((item) => (
        <div
          key={item.id}
          className="quantum-card p-3 cursor-pointer group hover:bg-glass-medium transition-colors"
          onClick={() => setSelectedItem(item)}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{item.emoji}</span>
            
            <div className="flex-1">
              <h3 className="holo-body text-system-text text-sm">{item.name}</h3>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantumToggle(item);
              }}
              className={`p-2 rounded-full transition-colors ${
                item.isFavorite ? 'bg-quantum-pink text-white' : 'bg-glass-medium'
              }`}
            >
              <Heart size={14} className={item.isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );



  return (
    <div className={`quantum-card p-4 ${className}`} {...props}>
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevious}
          disabled={disabled || !onPrevious}
          className="p-2 rounded-full bg-glass-medium hover:bg-glass-strong disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="text-center flex-1">
          <h1 className="text-quantum-title mb-1 text-lg">
            {meal?.name || 'Quantum Menu'}
          </h1>
          
          {/* Full Date Display */}
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-system-text mb-1">
              {getFormattedDate()}
            </h2>
          </div>
          
          {/* Day Label */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar size={14} className="text-system-text-secondary" />
            <p className="quantum-caption text-system-text-secondary text-xs">
              {dayLabel}
            </p>
          </div>
          
          {/* Live Indicator or Go Live Button */}
          <div className="flex justify-center mb-2">
            {isLive ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                LIVE NOW
              </div>
            ) : (
              <button
                onClick={onGoLive}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-full text-xs font-medium transition-colors"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                GO LIVE
              </button>
            )}
          </div>

        </div>
        
        <button
          onClick={onNext}
          disabled={disabled || !onNext}
          className="p-2 rounded-full bg-glass-medium hover:bg-glass-strong disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Menu Content - Fixed header with scrollable items */}
      <div className="max-h-96 overflow-y-auto">
        <QuantumMenuView />
      </div>

      {/* Community Menu Corrections */}
      <MenuCorrection
        meal={meal}
        date={currentDate}
        menuItems={currentMenuItems}
        onMenuUpdate={setCurrentMenuItems}
      />

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            <div
              className="quantum-card p-6 max-w-sm w-full relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {selectedItem.emoji}
                </div>
                
                <h2 className="neural-headline text-system-text mb-4 text-lg">
                  {selectedItem.name}
                </h2>
                
                <button
                  onClick={() => {
                    handleQuantumToggle(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="neural-button w-full hover:bg-holo-primary transition-colors"
                >
                  {selectedItem.isFavorite ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

QuantumMenuCard.displayName = 'QuantumMenuCard';

export default QuantumMenuCard;