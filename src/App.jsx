import { useState, useEffect } from 'react';
import './App.css';

const messNames = [
  { key: 'sannasi', label: 'Sannasi (Boys)' },
  { key: 'mblock', label: 'M-block (Girls)' },
];

// Meal schedule and placeholder data
const mealSchedule = [
  {
    name: 'Breakfast',
    start: { hour: 7, min: 0 },
    end: { hour: 9, min: 30 },
    items: [ { icon: '🥞', name: 'Idli' }, { icon: '🍲', name: 'Sambar' }, { icon: '🥥', name: 'Chutney' } ]
  },
  {
    name: 'Lunch',
    start: { hour: 11, min: 30 },
    end: { hour: 13, min: 30 },
    items: [ { icon: '🍚', name: 'Rice' }, { icon: '🥣', name: 'Dal' }, { icon: '🧀', name: 'Paneer Curry' } ]
  },
  {
    name: 'Snacks',
    start: { hour: 16, min: 30 },
    end: { hour: 17, min: 30 },
    items: [ { icon: '🥟', name: 'Samosa' }, { icon: '🍵', name: 'Tea' } ]
  },
  {
    name: 'Dinner',
    start: { hour: 19, min: 30 },
    end: { hour: 21, min: 0 },
    items: [ { icon: '🥙', name: 'Chapati' }, { icon: '🥗', name: 'Mixed Veg' }, { icon: '🍚', name: 'Curd Rice' } ]
  },
];

const getMinutes = (date) => date.getHours() * 60 + date.getMinutes();

function getCurrentMealIndex(now = new Date()) {
  const minutes = getMinutes(now);
  for (let i = 0; i < mealSchedule.length; i++) {
    const start = mealSchedule[i].start.hour * 60 + mealSchedule[i].start.min;
    const end = mealSchedule[i].end.hour * 60 + mealSchedule[i].end.min;
    if (minutes >= start && minutes < end) return i;
    // After last meal, show tomorrow's breakfast
    if (i === mealSchedule.length - 1 && minutes >= end) return 0;
  }
  // Before first meal, show breakfast
  return 0;
}

function getDayOffset(now = new Date()) {
  const minutes = getMinutes(now);
  const lastMealEnd = mealSchedule[mealSchedule.length - 1].end;
  const lastMealEndMinutes = lastMealEnd.hour * 60 + lastMealEnd.min;
  // If after dinner, offset day by +1
  return minutes >= lastMealEndMinutes ? 1 : 0;
}

function App() {
  const [selectedMess, setSelectedMess] = useState('sannasi');
  const [darkMode, setDarkMode] = useState(false);
  const [now, setNow] = useState(new Date());
  // mealNav: { dayOffset: 0 = today, 1 = tomorrow, -1 = yesterday, ...; mealIndex: 0-3 }
  const initialDayOffset = getDayOffset(now);
  const initialMealIndex = getCurrentMealIndex(now);
  const [mealNav, setMealNav] = useState({ dayOffset: initialDayOffset, mealIndex: initialMealIndex });

  // Live clock effect
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-update mealNav when time changes and user is on 'now'
  useEffect(() => {
    if (mealNav.dayOffset === getDayOffset(now)) {
      const currentMealIdx = getCurrentMealIndex(now);
      if (mealNav.mealIndex !== currentMealIdx) {
        setMealNav({ dayOffset: getDayOffset(now), mealIndex: currentMealIdx });
      }
    }
    // eslint-disable-next-line
  }, [now]);

  // Navigation logic
  const handlePrevMeal = () => {
    setMealNav((prev) => {
      if (prev.mealIndex === 0) {
        return { dayOffset: prev.dayOffset - 1, mealIndex: mealSchedule.length - 1 };
      }
      return { ...prev, mealIndex: prev.mealIndex - 1 };
    });
  };
  const handleNextMeal = () => {
    setMealNav((prev) => {
      if (prev.mealIndex === mealSchedule.length - 1) {
        return { dayOffset: prev.dayOffset + 1, mealIndex: 0 };
      }
      return { ...prev, mealIndex: prev.mealIndex + 1 };
    });
  };

  // Get meal and day label
  const meal = mealSchedule[mealNav.mealIndex];
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mealNav.dayOffset);
  const dayLabel = mealNav.dayOffset === 0 ? 'Today' : mealNav.dayOffset === 1 ? 'Tomorrow' : day.toLocaleDateString('en-IN', { weekday: 'long' });

  // Format clock
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-900 text-white flex flex-col w-full h-full fixed inset-0' : 'min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900 flex flex-col w-full h-full fixed inset-0'}>
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 shadow-md relative flex flex-col items-center">
        <h1 className="text-3xl font-extrabold tracking-wide drop-shadow">Messmate</h1>
        <p className="text-base font-medium opacity-90">SRM Hostel Mess Menu</p>
        <div className="mt-2 text-lg font-mono bg-white/20 rounded px-3 py-1 shadow inline-block tracking-widest">
          {timeString}
        </div>
        <button
          className="absolute top-4 right-4 bg-white/20 rounded-full px-3 py-1 text-lg font-semibold hover:bg-white/30 transition"
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
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
            <span className="font-bold text-lg tracking-wide text-gray-700 dark:text-gray-200">{meal.name}</span>
            <span className="text-xs text-gray-500">{dayLabel}</span>
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
          <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-4 flex flex-col items-center border-4 border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-blue-500 dark:text-blue-300">{meal.name}</span>
              <span className="text-xs text-gray-500">{meal.start.hour.toString().padStart(2, '0')}:{meal.start.min.toString().padStart(2, '0')} – {meal.end.hour.toString().padStart(2, '0')}:{meal.end.min.toString().padStart(2, '0')}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full">
              {meal.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 rounded-xl p-4 shadow hover:scale-105 transition text-lg font-semibold"
                >
                  <span className="text-2xl mr-2">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center text-xs text-gray-400 py-2">
        &copy; {new Date().getFullYear()} Messmate | SRM Hostel
      </footer>
    </div>
  );
}

export default App;
