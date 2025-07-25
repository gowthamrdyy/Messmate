import { useState, useEffect } from 'react';
import './App.css';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';

const messNames = [
  { key: 'sannasi', label: 'Sannasi (Boys)' },
  { key: 'mblock', label: 'M-block (Girls)' },
];

// Weekday and weekend meal schedules
const weekdaySchedule = [
  {
    name: 'Breakfast',
    start: { hour: 7, min: 0 },
    end: { hour: 9, min: 30 },
    items: [ { name: 'Idli' }, { name: 'Sambar' }, { name: 'Chutney' } ]
  },
  {
    name: 'Lunch',
    start: { hour: 11, min: 30 },
    end: { hour: 13, min: 30 },
    items: [ { name: 'Rice' }, { name: 'Dal' }, { name: 'Paneer Curry' } ]
  },
  {
    name: 'Snacks',
    start: { hour: 16, min: 30 },
    end: { hour: 17, min: 30 },
    items: [ { name: 'Samosa' }, { name: 'Tea' } ]
  },
  {
    name: 'Dinner',
    start: { hour: 19, min: 30 },
    end: { hour: 21, min: 0 },
    items: [ { name: 'Chapati' }, { name: 'Mixed Veg' }, { name: 'Curd Rice' } ]
  },
];

const weekendSchedule = [
  {
    name: 'Breakfast',
    start: { hour: 7, min: 30 },
    end: { hour: 9, min: 30 },
    items: [ { name: 'Idli' }, { name: 'Sambar' }, { name: 'Chutney' } ]
  },
  {
    name: 'Lunch',
    start: { hour: 12, min: 0 },
    end: { hour: 14, min: 0 },
    items: [ { name: 'Rice' }, { name: 'Dal' }, { name: 'Paneer Curry' } ]
  },
  {
    name: 'Snacks',
    start: { hour: 16, min: 30 },
    end: { hour: 17, min: 30 },
    items: [ { name: 'Samosa' }, { name: 'Tea' } ]
  },
  {
    name: 'Dinner',
    start: { hour: 19, min: 30 },
    end: { hour: 21, min: 0 },
    items: [ { name: 'Chapati' }, { name: 'Mixed Veg' }, { name: 'Curd Rice' } ]
  },
];

function getScheduleForDay(date) {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  return (day === 0 || day === 6) ? weekendSchedule : weekdaySchedule;
}

const getMinutes = (date) => date.getHours() * 60 + date.getMinutes();

function getCurrentOrNextMeal(now = new Date(), navDayOffset = 0) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + navDayOffset);
  const schedule = getScheduleForDay(date);
  const minutes = getMinutes(now);
  for (let i = 0; i < schedule.length; i++) {
    const start = schedule[i].start.hour * 60 + schedule[i].start.min;
    const end = schedule[i].end.hour * 60 + schedule[i].end.min;
    if (navDayOffset === 0 && minutes >= start && minutes < end) return { mealIndex: i, dayOffset: navDayOffset };
    if (navDayOffset === 0 && minutes < start) return { mealIndex: i, dayOffset: navDayOffset };
    if (navDayOffset !== 0) return { mealIndex: 0, dayOffset: navDayOffset }; // For browsing other days, default to breakfast
  }
  // After last meal, show tomorrow's breakfast
  return { mealIndex: 0, dayOffset: navDayOffset + 1 };
}

function App() {
  const [selectedMess, setSelectedMess] = useState('sannasi');
  const [now, setNow] = useState(new Date());
  // mealNav: { dayOffset: 0 = today, 1 = tomorrow, -1 = yesterday, ...; mealIndex: 0-3, isLive: true/false }
  const initial = getCurrentOrNextMeal(now, 0);
  const [mealNav, setMealNav] = useState({ dayOffset: initial.dayOffset, mealIndex: initial.mealIndex, isLive: true });

  // Live clock effect
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-update mealNav only if isLive is true
  useEffect(() => {
    if (mealNav.isLive) {
      const current = getCurrentOrNextMeal(now, 0);
      if (mealNav.dayOffset !== current.dayOffset || mealNav.mealIndex !== current.mealIndex) {
        setMealNav({ dayOffset: current.dayOffset, mealIndex: current.mealIndex, isLive: true });
      }
    }
    // eslint-disable-next-line
  }, [now]);

  // Navigation logic
  const handlePrevMeal = () => {
    setMealNav((prev) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + prev.dayOffset);
      const schedule = getScheduleForDay(date);
      if (prev.mealIndex === 0) {
        return { dayOffset: prev.dayOffset - 1, mealIndex: getScheduleForDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() + prev.dayOffset - 1)).length - 1, isLive: false };
      }
      return { ...prev, mealIndex: prev.mealIndex - 1, isLive: false };
    });
  };
  const handleNextMeal = () => {
    setMealNav((prev) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + prev.dayOffset);
      const schedule = getScheduleForDay(date);
      if (prev.mealIndex === schedule.length - 1) {
        return { dayOffset: prev.dayOffset + 1, mealIndex: 0, isLive: false };
      }
      return { ...prev, mealIndex: prev.mealIndex + 1, isLive: false };
    });
  };
  // Return to live mode
  const handleGoLive = () => {
    const current = getCurrentOrNextMeal(now, 0);
    setMealNav({ dayOffset: current.dayOffset, mealIndex: current.mealIndex, isLive: true });
  };

  // Get meal and day label
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mealNav.dayOffset);
  const schedule = getScheduleForDay(date);
  const meal = schedule[mealNav.mealIndex];
  const dayLabel = mealNav.dayOffset === 0 ? 'Today' : mealNav.dayOffset === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'long' });

  // Format clock (12-hour with AM/PM)
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  // Format meal time (12-hour with AM/PM)
  function formatTime(hour, min) {
    const d = new Date();
    d.setHours(hour);
    d.setMinutes(min);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900 flex flex-col w-full h-full fixed inset-0">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 shadow-md relative flex flex-col items-center">
        <h1 className="text-3xl font-extrabold tracking-wide drop-shadow">Messmate</h1>
        <p className="text-base font-medium opacity-90">SRM Hostel Mess Menu</p>
        <div className="mt-2 text-lg font-mono bg-white/20 rounded px-3 py-1 shadow inline-block tracking-widest">
          {timeString}
        </div>
      </header>
      {/* Mess Toggle Switch */}
      <div className="flex justify-center items-center mt-6 mb-2">
        <span className={`px-3 py-2 rounded-l-full font-semibold text-sm transition ${selectedMess === 'sannasi' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}>Sannasi</span>
        <label className="relative inline-flex items-center cursor-pointer mx-2">
          <input
            type="checkbox"
            checked={selectedMess === 'mblock'}
            onChange={() => setSelectedMess(selectedMess === 'sannasi' ? 'mblock' : 'sannasi')}
            className="sr-only peer"
          />
          <div className="w-14 h-8 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:bg-pink-400 transition-all duration-300"></div>
          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md transition-all duration-300 ${selectedMess === 'mblock' ? 'translate-x-6' : ''}`}></div>
        </label>
        <span className={`px-3 py-2 rounded-r-full font-semibold text-sm transition ${selectedMess === 'mblock' ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border border-pink-500'}`}>M-block</span>
      </div>
      {/* Meal Navigation */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center w-full mb-4">
          <button
            onClick={handlePrevMeal}
            className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 active:scale-95 transition"
          >
            &lt; Prev
          </button>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg tracking-wide text-gray-700">{meal.name}</span>
            <span className="text-xs text-gray-500">{dayLabel}</span>
            {!mealNav.isLive && (
              <button onClick={handleGoLive} className="mt-1 text-xs text-blue-600 underline">Go Live</button>
            )}
          </div>
          <button
            onClick={handleNextMeal}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 active:scale-95 transition"
          >
            Next &gt;
          </button>
        </div>
        {/* Meal Card */}
        <section className="w-full flex flex-col items-center">
          <div className="w-full bg-white rounded-3xl shadow-xl p-6 mb-4 flex flex-col items-center border-4 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-blue-500">{meal.name}</span>
              <span className="text-xs text-gray-500">{formatTime(meal.start.hour, meal.start.min)} – {formatTime(meal.end.hour, meal.end.min)}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full">
              {meal.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-xl p-4 shadow hover:scale-105 transition text-lg font-semibold"
                >
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-center justify-center gap-2 text-xs text-gray-500 py-4">
        <div className="flex gap-4 mb-1">
          <a href="https://instagram.com/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 text-lg"><FaInstagram /></a>
          <a href="https://github.com/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-gray-900 text-lg"><FaGithub /></a>
          <a href="https://linkedin.com/in/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 text-lg"><FaLinkedin /></a>
        </div>
        <div className="flex items-center gap-1">
          <span>Made with</span>
          <span className="text-red-500 text-base">♥</span>
          <span>Gowthamrdyy</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
