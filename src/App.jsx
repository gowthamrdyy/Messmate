import { useState } from 'react';
import './App.css';

const messNames = [
  { key: 'sannasi', label: 'Sannasi (Boys)' },
  { key: 'mblock', label: 'M-block (Girls)' },
];

// Placeholder meal data
const placeholderMeals = [
  { name: 'Breakfast', time: '7:30–9:00', items: ['Idli', 'Sambar', 'Chutney'] },
  { name: 'Lunch', time: '11:30–1:30', items: ['Rice', 'Dal', 'Paneer Curry'] },
  { name: 'Snacks', time: '4:30–5:30', items: ['Samosa', 'Tea'] },
  { name: 'Dinner', time: '7:00–9:00', items: ['Chapati', 'Mixed Veg', 'Curd Rice'] },
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function App() {
  const [selectedMess, setSelectedMess] = useState('sannasi');
  const [showWeekMenu, setShowWeekMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Placeholder: always show Lunch as current, Snacks as next
  const currentMeal = placeholderMeals[1];
  const nextMeal = placeholderMeals[2];

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-900 text-white flex flex-col' : 'min-h-screen bg-gray-50 text-gray-900 flex flex-col'}>
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold tracking-wide">Messmate</h1>
        <p className="text-center text-sm">SRM Hostel Mess Menu</p>
        <div className="absolute top-4 right-4">
          <button
            className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold hover:bg-white/30 transition"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <nav className="flex justify-center mt-4 gap-2">
        {messNames.map((mess) => (
          <button
            key={mess.key}
            className={`px-4 py-2 rounded-full font-semibold transition border-2 ${selectedMess === mess.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
            onClick={() => setSelectedMess(mess.key)}
          >
            {mess.label}
          </button>
        ))}
      </nav>
      <main className="flex-1 flex flex-col items-center justify-start p-4 w-full max-w-md mx-auto">
        <section className="w-full mt-6 mb-4">
          <h2 className="text-lg font-bold mb-1">Current Meal</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{currentMeal.name}</span>
              <span className="text-xs text-gray-500">{currentMeal.time}</span>
            </div>
            <ul className="list-disc list-inside text-sm">
              {currentMeal.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className="w-full mb-4">
          <h2 className="text-lg font-bold mb-1">Next Meal</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-green-600 dark:text-green-400">{nextMeal.name}</span>
              <span className="text-xs text-gray-500">{nextMeal.time}</span>
            </div>
            <ul className="list-disc list-inside text-sm">
              {nextMeal.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
        <button
          className="w-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg py-2 font-semibold mb-2"
          onClick={() => setShowWeekMenu((s) => !s)}
        >
          {showWeekMenu ? 'Hide' : 'Show'} Full Week Menu
        </button>
        {showWeekMenu && (
          <section className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-2">
            <h2 className="text-lg font-bold mb-2">Full Week Menu</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Day</th>
                    {placeholderMeals.map((meal) => (
                      <th key={meal.name} className="p-2 text-left">{meal.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weekDays.map((day) => (
                    <tr key={day}>
                      <td className="p-2 font-semibold">{day}</td>
                      {placeholderMeals.map((meal) => (
                        <td key={meal.name} className="p-2">
                          <ul className="list-disc list-inside">
                            {meal.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <footer className="text-center text-xs text-gray-400 py-2">
        &copy; {new Date().getFullYear()} Messmate | SRM Hostel
      </footer>
    </div>
  );
}

export default App;
