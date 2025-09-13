import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { memo } from 'react';
import Glass from './Glass';
import { getDayLabel } from '../../utils/dateHelpers';

const DaySelector = memo(({ 
  selectedDate, 
  onDateSelect, 
  className = '' 
}) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const currentDayIndex = today.getDay();

  const handleDayClick = (dayIndex) => {
    const newDate = new Date();
    const daysToAdd = dayIndex - currentDayIndex;
    newDate.setDate(today.getDate() + daysToAdd);
    onDateSelect(newDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${className}`}
    >
      <Glass
        variant="subtle"
        rounded="2xl"
        className="p-1"
      >
        <div className="flex items-center justify-between px-2 py-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => {
              const prevDate = new Date(selectedDate);
              prevDate.setDate(selectedDate.getDate() - 1);
              onDateSelect(prevDate);
            }}
          >
            <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" style={{ display: 'inline-block' }} />
          </motion.button>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600 dark:text-blue-400" style={{ display: 'inline-block' }} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: selectedDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
              })}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(selectedDate.getDate() + 1);
              onDateSelect(nextDate);
            }}
          >
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" style={{ display: 'inline-block' }} />
          </motion.button>
        </div>

        <div className="grid grid-cols-7 gap-1 px-2 pb-2">
          {days.map((day, index) => {
            const isToday = index === currentDayIndex;
            const isSelected = selectedDate.getDay() === index;
            
            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDayClick(index)}
                className={`
                  relative p-2 rounded-lg text-xs font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-blue-500 text-white shadow-md'
                    : isToday
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                {day}
                {isToday && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </Glass>
    </motion.div>
  );
});

DaySelector.displayName = 'DaySelector';

export default DaySelector;
