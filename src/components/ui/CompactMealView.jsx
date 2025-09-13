import { motion } from 'framer-motion';
import { memo } from 'react';
import { Calendar, Clock, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { StaggerContainer, StaggerItem } from './PageTransition';
import { formatTime, getDayLabel } from '../../utils/dateHelpers';
import { getScheduleForDay } from '../../utils/mealSchedule';
import { FOOD_EMOJIS } from '../../utils/constants';
import { hasSimilarFavorite, getMatchingFavorite } from '../../utils/itemMatching';
import useAppStore from '../../store/useAppStore';
import communityRatings from '../../services/communityRatings';
import { useItemRating } from '../../hooks/useRating';

// Rating display component for individual items
const RatingDisplay = ({ item, mess, date, mealName }) => {
  const { day, meal: mealType } = communityRatings.getCurrentMealContext(date, mealName);
  const { rating } = useItemRating(item, mess, day, mealType);
  
  if (!rating) return null;
  
  return (
    <span className="text-caption bg-yellow-500 text-white px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
      {rating.rating}⭐
    </span>
  );
};

const CompactMealView = memo(({ 
  date, 
  menuItems, 
  className = '' 
}) => {
  const { favorites, toggleFavorite, selectedMess } = useAppStore();
  const schedule = getScheduleForDay(date);
  
  // Manual HTML heart icon as fallback
  const HeartIcon = ({ isFavorite }) => (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill={isFavorite ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      style={{ display: 'inline-block' }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
  
  // Get food emoji for item
  const getFoodEmoji = (item) => {
    const itemLower = item.toLowerCase().trim();
    const cleanItem = itemLower
      .replace(/\*\*/g, '')
      .replace(/\//g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Check for exact matches first
    if (FOOD_EMOJIS[cleanItem]) {
      return FOOD_EMOJIS[cleanItem];
    }
    
    // Check for partial matches
    for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
      if (key !== 'default' && cleanItem.includes(key)) {
        return emoji;
      }
    }
    
    return FOOD_EMOJIS.default;
  };

  const handleFavoriteToggle = (item) => {
    toggleFavorite(item);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card variant="default" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <StaggerContainer staggerDelay={0.1}>
            {schedule.map((meal, mealIndex) => {
              const mealItems = menuItems[meal.name.toLowerCase()] || [];
              
              return (
                <StaggerItem key={meal.name}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="mb-6 last:mb-0 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                  >
                    {/* Meal Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getFoodEmoji(meal.name)}</span>
                        <h3 className="font-display font-semibold text-lg md:text-xl lg:text-2xl text-gray-900 dark:text-white">
                          {meal.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-body-small text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        <span>
                          {formatTime(meal.start.hour, meal.start.min)} - {formatTime(meal.end.hour, meal.end.min)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Meal Items */}
                    {mealItems.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mealItems.map((item, itemIndex) => {
                          const isFavorite = favorites.includes(item) || hasSimilarFavorite(item, favorites);
                          
                          return (
                            <motion.div
                              key={`${item}-${itemIndex}`}
                              whileHover={{ scale: 1.02 }}
                              className={`
                                flex items-center justify-between p-2 rounded-lg transition-all duration-200
                                ${isFavorite 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                                  : 'bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                                }
                              `}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-lg flex-shrink-0">
                                  {getFoodEmoji(item)}
                                </span>
                                <span className="text-body font-medium text-gray-800 dark:text-gray-200 truncate">
                                  {item.replace(/\*\*/g, '')}
                                </span>
                                <div className="flex items-center gap-1">
                                  {isFavorite && (
                                    <span className="text-caption bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                                      ★
                                    </span>
                                  )}
                                  <RatingDisplay 
                                    item={item} 
                                    mess={selectedMess} 
                                    date={date} 
                                    mealName={meal.name} 
                                  />
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
                                  p-1 rounded-full transition-colors duration-200 ml-2
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
                                />
                              </motion.button>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                        Menu not available for {meal.name}
                      </p>
                    )}
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
});

CompactMealView.displayName = 'CompactMealView';

export default CompactMealView;
