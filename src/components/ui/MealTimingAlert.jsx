import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Bell } from 'lucide-react';
import { getScheduleForDay } from '../../utils/mealSchedule';
import { formatTime } from '../../utils/dateHelpers';

const MealTimingAlert = ({ currentTime, className = '' }) => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const checkMealTiming = () => {
      const now = new Date(currentTime);
      const schedule = getScheduleForDay(now);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (const meal of schedule) {
        const startMinutes = meal.start.hour * 60 + meal.start.min;
        const endMinutes = meal.end.hour * 60 + meal.end.min;
        
        // 15 minutes before meal starts
        if (currentMinutes >= startMinutes - 15 && currentMinutes < startMinutes) {
          setAlert({
            type: 'starting',
            meal: meal.name,
            time: formatTime(meal.start.hour, meal.start.min),
            minutesLeft: startMinutes - currentMinutes
          });
          return;
        }
        
        // During meal time
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          // 15 minutes before meal ends
          if (currentMinutes >= endMinutes - 15) {
            setAlert({
              type: 'ending',
              meal: meal.name,
              time: formatTime(meal.end.hour, meal.end.min),
              minutesLeft: endMinutes - currentMinutes
            });
            return;
          }
          
          // Currently serving
          setAlert({
            type: 'serving',
            meal: meal.name,
            endTime: formatTime(meal.end.hour, meal.end.min),
            minutesLeft: endMinutes - currentMinutes
          });
          return;
        }
      }
      
      setAlert(null);
    };

    checkMealTiming();
  }, [currentTime]);

  if (!alert) return null;

  const getAlertConfig = () => {
    switch (alert.type) {
      case 'starting':
        return {
          icon: <Bell className="w-4 h-4" />,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          title: `${alert.meal} starts in ${alert.minutesLeft} min`,
          subtitle: `Get ready! ${alert.meal} begins at ${alert.time}`
        };
      case 'ending':
        return {
          icon: <Clock className="w-4 h-4" />,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          title: `${alert.meal} ends in ${alert.minutesLeft} min`,
          subtitle: `Hurry up! ${alert.meal} closes at ${alert.time}`
        };
      case 'serving':
        return {
          icon: <Clock className="w-4 h-4" />,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
          title: `${alert.meal} is being served`,
          subtitle: `Available until ${alert.endTime} (${alert.minutesLeft} min left)`
        };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg p-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: alert.type === 'ending' ? [0, -5, 5, 0] : 0
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            {config.icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">
              {config.title}
            </p>
            <p className="text-xs opacity-75">
              {config.subtitle}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MealTimingAlert;