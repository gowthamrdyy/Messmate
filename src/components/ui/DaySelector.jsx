import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { memo } from 'react';

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
      <div className="card-glass p-2">
        <div className="flex items-center justify-between px-2 py-2 mb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl hover:bg-surface-200 dark:hover:bg-white/10 transition-colors text-text-secondary"
            onClick={() => {
              const prevDate = new Date(selectedDate);
              prevDate.setDate(selectedDate.getDate() - 1);
              onDateSelect(prevDate);
            }}
          >
            <ChevronLeft size={20} />
          </motion.button>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-200 dark:bg-white/5 rounded-full">
            <Calendar size={16} className="text-nebula-primary" />
            <span className="text-sm font-bold text-text-primary">
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
            className="p-2 rounded-xl hover:bg-surface-200 dark:hover:bg-white/10 transition-colors text-text-secondary"
            onClick={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(selectedDate.getDate() + 1);
              onDateSelect(nextDate);
            }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        <div className="grid grid-cols-7 gap-1">
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
                  relative p-2.5 rounded-xl text-xs font-bold transition-all duration-300
                  ${isSelected
                    ? 'bg-nebula-primary text-white shadow-lg shadow-nebula-primary/25'
                    : isToday
                      ? 'bg-nebula-primary/10 text-nebula-primary'
                      : 'hover:bg-surface-200 dark:hover:bg-white/5 text-text-secondary'
                  }
                `}
              >
                {day}
                {isToday && !isSelected && (
                  <motion.div
                    layoutId="todayIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-nebula-primary rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});

DaySelector.displayName = 'DaySelector';

export default DaySelector;
