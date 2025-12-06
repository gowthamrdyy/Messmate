/**
 * Format time to 12-hour format with AM/PM
 * @param {number} hour - Hour (0-23)
 * @param {number} min - Minutes (0-59)
 * @returns {string} - Formatted time string
 */
export function formatTime(hour, min) {
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(min);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
}

/**
 * Format current time to display string
 * @param {Date} date - Date object
 * @returns {string} - Formatted time string with seconds
 */
export function formatCurrentTime(date) {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  });
}

/**
 * Get day label for navigation
 * @param {number} dayOffset - Day offset from today
 * @param {Date} baseDate - Base date to calculate from
 * @returns {string} - Day label (day name)
 */
export function getDayLabel(dayOffset, baseDate = new Date()) {
  const date = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + dayOffset
  );
  
  return date.toLocaleDateString('en-IN', { weekday: 'long' });
}

/**
 * Get day key for menu data lookup
 * @param {Date} date - Date object
 * @returns {string} - Day key (monday, tuesday, etc.)
 */
export function getDayKey(date) {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return dayNames[date.getDay()];
}

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} - True if date is today
 */
export function isToday(date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if a date is weekend
 * @param {Date} date - Date to check
 * @returns {boolean} - True if date is weekend (Saturday or Sunday)
 */
export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Get minutes since midnight
 * @param {Date} date - Date object
 * @returns {number} - Minutes since midnight
 */
export function getMinutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}