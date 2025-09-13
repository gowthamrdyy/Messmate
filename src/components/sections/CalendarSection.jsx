import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, Heart } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { StaggerContainer, StaggerItem } from '../ui/PageTransition';
import { formatTime, getDayKey, getDayLabel } from '../../utils/dateHelpers';
import { getScheduleForDay } from '../../utils/mealSchedule';
import useAppStore from '../../store/useAppStore';
import communityRatings from '../../services/communityRatings';
import { useItemRating } from '../../hooks/useRating';

// Rating display component for calendar items
const CalendarRatingDisplay = ({ item, mess, date, mealName }) => {
  const { day, meal: mealType } = communityRatings.getCurrentMealContext(date, mealName);
  const { rating } = useItemRating(item, mess, day, mealType);
  
  if (!rating) return null;
  
  return (
    <span className="text-xs bg-yellow-500 text-white px-1 py-0.5 rounded-full font-semibold">
      {rating.rating}⭐
    </span>
  );
};

const CalendarSection = ({ className = '', menuData }) => {
  const { selectedMess, currentTime, favorites, toggleFavorite } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(currentTime);

  // Manual HTML heart icon as fallback
  const HeartIcon = ({ isFavorite }) => (
    <svg 
      width="12" 
      height="12" 
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

  // Manual HTML navigation icons as fallbacks
  const ChevronLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M8 2v4"></path>
      <path d="M16 2v4"></path>
      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
      <path d="M3 10h18"></path>
    </svg>
  );

  // Generate week dates
  const getWeekDates = (baseDate) => {
    const dates = [];
    const startOfWeek = new Date(baseDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // First day is Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedDate);
  const today = currentTime;

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getDayMeals = (date) => {
    const dayKey = getDayKey(date);
    const schedule = getScheduleForDay(date);
    
    return schedule.map(meal => ({
      ...meal,
      items: menuData?.[selectedMess]?.[dayKey]?.[meal.name.toLowerCase()] || []
    }));
  };

  const handleFavoriteToggle = (item) => {
    toggleFavorite(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <Card variant="default" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              Weekly Menu
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek(-1)}
                className="p-1"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
                className="text-xs px-2"
              >
                Today
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek(1)}
                className="p-1"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Week Calendar */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {weekDates.map((date, index) => (
              <motion.button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-2 rounded-lg text-sm font-medium transition-colors
                  ${isSelected(date)
                    ? 'bg-green-500 text-white'
                    : isToday(date)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {date.getDate()}
                {isToday(date) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Selected Day Info */}
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            {isToday(selectedDate) && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                LIVE NOW
              </div>
            )}
          </div>

          {/* Selected Day Meals */}
          <div className="space-y-4">

            <StaggerContainer staggerDelay={0.1}>
              {getDayMeals(selectedDate).map((meal, index) => (
                <StaggerItem key={meal.name}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {meal.name}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        {formatTime(meal.start.hour, meal.start.min)} - {formatTime(meal.end.hour, meal.end.min)}
                      </div>
                    </div>
                    
                    {meal.items.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {meal.items.slice(0, 6).map((item, itemIndex) => {
                          const isFavorite = favorites.includes(item);
                          
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-center justify-between text-gray-600 dark:text-gray-400"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="truncate">
                                  • {item.replace(/\*\*/g, '')}
                                </span>
                                <div className="flex items-center gap-1">
                                  {isFavorite && (
                                    <span className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded-full font-semibold">
                                      ★
                                    </span>
                                  )}
                                  <CalendarRatingDisplay 
                                    item={item} 
                                    mess={selectedMess} 
                                    date={selectedDate} 
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
                                  p-1 rounded-full transition-colors duration-200 ml-1 flex-shrink-0
                                  ${isFavorite 
                                    ? 'text-red-500 hover:text-red-600' 
                                    : 'text-gray-400 hover:text-red-400'
                                  }
                                `}
                                aria-label={isFavorite ? `Remove ${item} from favorites` : `Add ${item} to favorites`}
                                aria-pressed={isFavorite}
                              >
                                <Heart
                                  size={12}
                                  className={isFavorite ? 'fill-current' : ''}
                                />
                              </motion.button>
                            </div>
                          );
                        })}
                        {meal.items.length > 6 && (
                          <div className="text-gray-500 dark:text-gray-500 text-xs">
                            +{meal.items.length - 6} more items
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Menu not available
                      </p>
                    )}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CalendarSection;