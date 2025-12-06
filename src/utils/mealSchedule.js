// Weekday and weekend meal schedules
export const weekdaySchedule = [
  {
    name: 'Breakfast',
    start: { hour: 7, min: 0 },
    end: { hour: 9, min: 30 },
  },
  {
    name: 'Lunch',
    start: { hour: 11, min: 30 },
    end: { hour: 13, min: 30 },
  },
  {
    name: 'Snacks',
    start: { hour: 16, min: 30 },
    end: { hour: 17, min: 30 },
  },
  {
    name: 'Dinner',
    start: { hour: 19, min: 30 },
    end: { hour: 21, min: 0 },
  },
];

export const weekendSchedule = [
  {
    name: 'Breakfast',
    start: { hour: 7, min: 30 },
    end: { hour: 9, min: 30 },
  },
  {
    name: 'Lunch',
    start: { hour: 12, min: 0 },
    end: { hour: 14, min: 0 },
  },
  {
    name: 'Snacks',
    start: { hour: 16, min: 30 },
    end: { hour: 17, min: 30 },
  },
  {
    name: 'Dinner',
    start: { hour: 19, min: 30 },
    end: { hour: 21, min: 0 },
  },
];

export function getScheduleForDay(date) {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  return (day === 0 || day === 6) ? weekendSchedule : weekdaySchedule;
}