import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, Heart } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { StaggerContainer, StaggerItem } from '../ui/PageTransition';
import { formatTime, getDayKey } from '../../utils/dateHelpers';
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
    <span className="text-[10px] bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-md border border-yellow-400/20 font-bold">
      {rating.rating}⭐
    </span>
  );
};

const CalendarSection = ({ className = '', menuData }) => {
  const { selectedMess, currentTime, favorites, toggleFavorite } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(currentTime);

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
      <div className="card-glass p-6 bg-surface-100/90 dark:bg-nebula-dark/90 backdrop-blur-xl border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-nebula-primary/10 rounded-xl">
              <Calendar className="w-5 h-5 text-nebula-primary" />
            </div>
            <h2 className="font-display font-bold text-xl text-text-primary">
              Weekly Menu
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-surface-200 dark:bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-1.5 rounded-lg hover:bg-surface-300 dark:hover:bg-white/10 transition-colors text-text-secondary"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-surface-300 dark:hover:bg-white/10 transition-colors text-text-primary"
            >
              Today
            </button>

            <button
              onClick={() => navigateWeek(1)}
              className="p-1.5 rounded-lg hover:bg-surface-300 dark:hover:bg-white/10 transition-colors text-text-secondary"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Week Calendar */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {weekDates.map((date, index) => (
            <motion.button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border
                ${isSelected(date)
                  ? 'bg-nebula-primary text-white border-nebula-primary shadow-lg shadow-nebula-primary/25'
                  : isToday(date)
                    ? 'bg-nebula-primary/10 text-nebula-primary border-nebula-primary/20'
                    : 'bg-surface-200 dark:bg-white/5 text-text-secondary border-transparent hover:bg-surface-300 dark:hover:bg-white/10'
                }
              `}
            >
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-80 mb-1">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-lg font-bold">
                {date.getDate()}
              </span>
              {isToday(date) && !isSelected(date) && (
                <div className="absolute bottom-1.5 w-1 h-1 bg-nebula-primary rounded-full" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Day Info */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display font-bold text-2xl text-text-primary">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          {isToday(selectedDate) && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-nebula-success/10 text-nebula-success rounded-full border border-nebula-success/20">
              <div className="w-2 h-2 bg-nebula-success rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Live Now</span>
            </div>
          )}
        </div>

        {/* Selected Day Meals */}
        <div className="space-y-4">
          <StaggerContainer staggerDelay={0.1}>
            {getDayMeals(selectedDate).map((meal, index) => (
              <StaggerItem key={meal.name}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl bg-surface-100 dark:bg-white/5 border border-white/20 dark:border-white/5 hover:border-nebula-primary/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-bold text-lg text-text-primary group-hover:text-nebula-primary transition-colors">
                      {meal.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary bg-surface-200 dark:bg-black/20 px-2.5 py-1 rounded-lg">
                      <Clock size={12} />
                      {formatTime(meal.start.hour, meal.start.min)} - {formatTime(meal.end.hour, meal.end.min)}
                    </div>
                  </div>

                  {meal.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {meal.items.slice(0, 8).map((item, itemIndex) => {
                        const isFavorite = favorites.includes(item);
                        const cleanItem = item.replace(/\*\*/g, '');

                        return (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-nebula-secondary/50" />
                              <span className="text-sm text-text-secondary font-medium truncate">
                                {cleanItem}
                              </span>
                              <div className="flex items-center gap-1">
                                {isFavorite && (
                                  <span className="text-[10px] bg-nebula-error/10 text-nebula-error px-1.5 py-0.5 rounded-md border border-nebula-error/20 font-bold">
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

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFavoriteToggle(item);
                              }}
                              className={`
                                p-1.5 rounded-full transition-all duration-200 ml-2 flex-shrink-0
                                ${isFavorite
                                  ? 'text-nebula-error bg-nebula-error/10'
                                  : 'text-text-tertiary hover:text-nebula-error hover:bg-nebula-error/10'
                                }
                              `}
                              aria-label={isFavorite ? `Remove ${item} from favorites` : `Add ${item} to favorites`}
                            >
                              <Heart
                                size={14}
                                className={isFavorite ? 'fill-current' : ''}
                              />
                            </motion.button>
                          </div>
                        );
                      })}
                      {meal.items.length > 8 && (
                        <div className="col-span-full text-center mt-2">
                          <span className="text-xs font-medium text-text-tertiary bg-surface-200 dark:bg-white/5 px-3 py-1 rounded-full">
                            +{meal.items.length - 8} more items
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-xl">
                      <p className="text-sm text-text-tertiary italic">
                        Menu not available for this meal
                      </p>
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarSection;