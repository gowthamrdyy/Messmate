import { motion, AnimatePresence } from 'framer-motion';
import { useState, memo, useMemo, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { ComponentLoadingState } from './LoadingState';
import { StaggerContainer, StaggerItem } from './PageTransition';
import { formatTime } from '../../utils/dateHelpers';
import { FOOD_EMOJIS } from '../../utils/constants';
import { hasSimilarFavorite, getMatchingFavorite } from '../../utils/itemMatching';
import { fadeSlideVariants } from '../../hooks/useSlideTransition';
import { useProcessedArray, useRenderTracking } from '../../hooks/usePerformance';
import useAppStore from '../../store/useAppStore';
import communityRatings from '../../services/communityRatings';
import { useMealRatings } from '../../hooks/useRating';

const MealCard = memo(({ 
  meal, 
  menuItems = [], 
  dayLabel = '',
  className = '',
  showHorizontalScroll = false,
  slideDirection = 0,
  onPrevious,
  onNext,
  isLive = false,
  disabled = false,
  ...props 
}) => {
  const { favorites, toggleFavorite, currentTime, mealNavigation, selectedMess } = useAppStore();
  const [hoveredItem, setHoveredItem] = useState(null);

  // Get meal context for ratings
  const mealDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + mealNavigation.dayOffset);
  const { day, meal: mealType } = meal ? communityRatings.getCurrentMealContext(mealDate, meal.name) : { day: null, meal: null };
  
  // Load ratings for all items in this meal
  const { ratings: mealRatings } = useMealRatings(menuItems, selectedMess, day, mealType);



  // Navigation icons
  const ChevronLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  );

  const WifiIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12a10 10 0 0 1 20 0"></path>
      <path d="M5 12a7 7 0 0 1 14 0"></path>
      <path d="M8 12a4 4 0 0 1 8 0"></path>
      <circle cx="12" cy="12" r="1"></circle>
    </svg>
  );



  // Track renders in development
  useRenderTracking('MealCard', [meal?.name, menuItems.length, favorites.length]);

  // Memoize expensive emoji matching function
  const getFoodEmoji = useCallback((item) => {
    const itemLower = item.toLowerCase().trim();
    
    // Remove common prefixes/suffixes and special characters
    const cleanItem = itemLower
      .replace(/\*\*/g, '') // Remove ** markers
      .replace(/\//g, ' ') // Replace / with space for better matching
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    // First, try exact matches for multi-word items
    const exactMatches = Object.entries(FOOD_EMOJIS).filter(([key]) => 
      key !== 'default' && cleanItem === key
    );
    if (exactMatches.length > 0) {
      return exactMatches[0][1];
    }
    
    // Then try phrase matches (for items like "paneer butter masala")
    const phraseMatches = Object.entries(FOOD_EMOJIS).filter(([key]) => 
      key !== 'default' && key.includes(' ') && cleanItem.includes(key)
    );
    if (phraseMatches.length > 0) {
      // Return the longest match (most specific)
      const longestMatch = phraseMatches.reduce((a, b) => a[0].length > b[0].length ? a : b);
      return longestMatch[1];
    }
    
    // Finally, try word-based matching (but be more careful)
    const words = cleanItem.split(' ');
    for (const word of words) {
      // Skip very short words that might cause false matches
      if (word.length < 3) continue;
      
      for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
        if (key === 'default') continue;
        
        // For single-word keys, match whole words only
        if (!key.includes(' ') && word === key) {
          return emoji;
        }
        
        // For multi-word keys, check if the item contains the key
        if (key.includes(' ') && cleanItem.includes(key)) {
          return emoji;
        }
      }
    }
    
    return FOOD_EMOJIS.default;
  }, []);

  // Memoize sorted menu items with favorites first
  const sortedMenuItems = useProcessedArray(
    menuItems,
    null, // no filter
    (a, b) => {
      const aIsFavorite = favorites.includes(a) || hasSimilarFavorite(a, favorites);
      const bIsFavorite = favorites.includes(b) || hasSimilarFavorite(b, favorites);
      
      // If both are favorites or both are not favorites, maintain original order
      if (aIsFavorite === bIsFavorite) {
        return menuItems.indexOf(a) - menuItems.indexOf(b);
      }
      
      // Favorites come first
      return bIsFavorite - aIsFavorite;
    },
    [favorites]
  );

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback((item) => {
    const matchingFavorite = getMatchingFavorite(item, favorites);
    const targetItem = matchingFavorite || item;
    
    toggleFavorite(targetItem);
    
    // Track in community service (temporarily disabled)
    // communityService.trackFavorite(targetItem, 'sannasi');
  }, [favorites, toggleFavorite]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  // Show loading state if no meal data
  if (!meal) {
    return (
      <Card variant="default" padding="lg" className="w-full max-w-none overflow-hidden">
        <ComponentLoadingState 
          variant="spinner" 
          message="Loading meal information..." 
          className="py-8"
        />
      </Card>
    );
  }

  return (
    <motion.article
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`w-full ${className}`}
      role="region"
      aria-labelledby={`meal-${meal.name.toLowerCase()}-title`}
      aria-describedby={`meal-${meal.name.toLowerCase()}-description`}
      {...props}
    >
      <Card variant="default" padding="lg" className="w-full max-w-none overflow-hidden">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative"
          >
            {/* Navigation and Meal Title in Same Line */}
            <div className="flex items-center justify-between mb-4">
              {/* Previous Button */}
              <motion.button
                onClick={onPrevious}
                disabled={disabled}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                  text-white shadow-md hover:shadow-lg
                  transition-all duration-200 transform hover:scale-105 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                `}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                aria-label="Go to previous meal"
              >
                <ChevronLeftIcon />
              </motion.button>

              {/* Meal Title */}
              <CardTitle 
                className="flex items-center justify-center gap-2"
                id={`meal-${meal.name.toLowerCase()}-title`}
              >
                <span className="text-xl" role="img" aria-label={`${meal.name} emoji`}>{getFoodEmoji(meal.name)}</span>
                <span className="font-display font-semibold text-lg md:text-xl lg:text-2xl text-gray-900 dark:text-white">
                  {meal.name}
                </span>
              </CardTitle>

              {/* Next Button */}
              <motion.button
                onClick={onNext}
                disabled={disabled}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                  text-white shadow-md hover:shadow-lg
                  transition-all duration-200 transform hover:scale-105 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                aria-label="Go to next meal"
              >
                <ChevronRightIcon />
              </motion.button>
            </div>

            {/* Live Indicator */}
            {isLive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg border border-white/20">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      scale: { duration: 1.5, repeat: Infinity },
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                    }}
                    className="flex items-center justify-center"
                  >
                    <WifiIcon />
                  </motion.div>
                  <span className="text-xs font-bold tracking-wide">LIVE</span>
                </div>
              </motion.div>
            )}
            <CardDescription 
              className="text-center text-body-small text-gray-600 dark:text-gray-400"
              id={`meal-${meal.name.toLowerCase()}-description`}
            >
              {formatTime(meal.start.hour, meal.start.min)} – {formatTime(meal.end.hour, meal.end.min)}
            </CardDescription>
            {dayLabel && (
              <CardDescription className="text-center text-caption text-gray-500 dark:text-gray-400">
                {dayLabel}
              </CardDescription>
            )}
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {menuItems.length > 0 ? (
              <motion.div
                key="menu-items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  showHorizontalScroll
                    ? "flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory custom-scrollbar"
                    : "grid grid-cols-1 gap-3 max-h-72 overflow-y-auto custom-scrollbar p-1"
                }
              >
                <StaggerContainer staggerDelay={0.05}>
                  {sortedMenuItems.map((item, idx) => {
                  const isFavorite = favorites.includes(item) || hasSimilarFavorite(item, favorites);
                  const matchingFavorite = getMatchingFavorite(item, favorites);
                  
                  return (
                    <StaggerItem key={`${item}-${idx}`}>
                      <motion.div

                      variants={itemVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoveredItem(idx)}
                      onHoverEnd={() => setHoveredItem(null)}
                      className={`
                        flex items-center gap-3 transition-all duration-200 cursor-pointer
                        rounded-lg px-3 py-2.5 mb-1 hover:shadow-md dark:hover:shadow-lg
                        ${showHorizontalScroll ? 'min-w-[200px] snap-start' : 'w-full'}
                        ${hoveredItem === idx ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                        ${isFavorite 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                        }
                      `}
                    >
                      <motion.span 
                        className="text-lg flex-shrink-0"
                        animate={{ 
                          scale: hoveredItem === idx ? 1.2 : 1,
                          rotate: hoveredItem === idx ? [0, -10, 10, 0] : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        role="img"
                        aria-label={`${item} emoji`}
                      >
                        {getFoodEmoji(item)}
                      </motion.span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-body font-medium text-gray-800 dark:text-gray-200 block truncate">
                            {item}
                          </span>
                          <div className="flex items-center gap-1">
                            {isFavorite && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-caption bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-semibold"
                              >
                                ★
                              </motion.span>
                            )}
                            {mealRatings[item] && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-caption bg-yellow-500 text-white px-1.5 py-0.5 rounded-full font-semibold"
                              >
                                {mealRatings[item].rating}⭐
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Favorite button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(item);
                        }}
                        className={`
                          p-1 rounded-full transition-colors duration-200
                          ${isFavorite 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-400 hover:text-red-400'
                          }
                        `}
                        aria-label={isFavorite ? `Remove ${item} from favorites` : `Add ${item} to favorites`}
                        aria-pressed={isFavorite}
                      >
                        <Heart
                          size={14}
                          className={isFavorite ? 'fill-current' : ''}
                          style={{ display: 'inline-block' }}
                          aria-hidden="true"
                        />
                      </motion.button>
                    </motion.div>
                    </StaggerItem>
                  );
                  })}
                </StaggerContainer>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                <motion.span
                  className="text-4xl mb-3 block"
                  animate={{ 
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  🍽️
                </motion.span>
                <p className="text-sm font-medium">No menu items available</p>
                <p className="text-xs mt-1 opacity-75">Check back later for updates</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.article>
  );
});

MealCard.displayName = 'MealCard';

export default MealCard;