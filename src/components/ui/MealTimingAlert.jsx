import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Bell, Utensils } from 'lucide-react';
import { getScheduleForDay } from '../../utils/mealSchedule';
import { formatTime, getDayKey } from '../../utils/dateHelpers';
import useNotifications from '../../hooks/useNotifications';
import useAppStore from '../../store/useAppStore';
import { getFlirtyMessage } from '../../utils/notificationMessages';

const MealTimingAlert = ({ currentTime, className = '' }) => {
  const [alert, setAlert] = useState(null);
  const { sendNotification } = useNotifications();
  const { notificationLanguage, selectedMess } = useAppStore();
  const lastNotifiedRef = useRef(null);

  // We need menu data to find specific food items for the notification
  // Since we don't have direct access to menuData prop here, we'll try to get it from local storage or cache
  // In a real app, this should probably be passed down or accessed via store
  const getMenuItemsForMeal = (date, mealName) => {
    try {
      const dayKey = getDayKey(date);
      // This is a simplified way to get data - ideally we'd use the store or passed props
      // For now, we'll just return empty array if we can't easily access the full menu data
      // The getFlirtyMessage function handles empty arrays gracefully
      return [];
    } catch (e) {
      return [];
    }
  };

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
          const minutesLeft = startMinutes - currentMinutes;

          setAlert({
            type: 'starting',
            meal: meal.name,
            time: formatTime(meal.start.hour, meal.start.min),
            minutesLeft
          });

          // Send notification if not already sent for this meal today
          const notificationKey = `${now.toDateString()}-${meal.name}-starting`;
          if (lastNotifiedRef.current !== notificationKey && minutesLeft <= 15) {
            // Get flirty message
            // Note: In a real implementation, we would pass the actual food items here
            // For now, we'll pass the meal name which will trigger generic or meal-specific templates
            const message = getFlirtyMessage(notificationLanguage, meal.name, [meal.name.toLowerCase()]);

            sendNotification(`🍽️ ${meal.name} Time!`, {
              body: message,
              tag: notificationKey
            });
            lastNotifiedRef.current = notificationKey;
          }
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
  }, [currentTime, sendNotification, notificationLanguage]);

  if (!alert) return null;

  const getAlertConfig = () => {
    switch (alert.type) {
      case 'starting':
        return {
          icon: <Bell className="w-5 h-5" />,
          bgColor: 'bg-nebula-warning/10',
          borderColor: 'border-nebula-warning/20',
          textColor: 'text-nebula-warning',
          title: `${alert.meal} starts in ${alert.minutesLeft} min`,
          subtitle: `Get ready! Starts at ${alert.time}`
        };
      case 'ending':
        return {
          icon: <Clock className="w-5 h-5" />,
          bgColor: 'bg-nebula-error/10',
          borderColor: 'border-nebula-error/20',
          textColor: 'text-nebula-error',
          title: `${alert.meal} ends in ${alert.minutesLeft} min`,
          subtitle: `Hurry up! Closes at ${alert.time}`
        };
      case 'serving':
        return {
          icon: <Utensils className="w-5 h-5" />,
          bgColor: 'bg-nebula-success/10',
          borderColor: 'border-nebula-success/20',
          textColor: 'text-nebula-success',
          title: `${alert.meal} is Live`,
          subtitle: `Open until ${alert.endTime}`
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
        className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-4 ${className} backdrop-blur-sm shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={`p-2 rounded-xl bg-white/20 ${config.textColor}`}
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
            <p className={`font-bold text-sm ${config.textColor}`}>
              {config.title}
            </p>
            <p className={`text-xs opacity-80 ${config.textColor}`}>
              {config.subtitle}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MealTimingAlert;