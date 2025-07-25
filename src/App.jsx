import { useState, useEffect } from 'react';
import './App.css';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Analytics } from "@vercel/analytics/react";

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
    items: [ { name: 'Sweet' }, { name: 'Bread' }, { name: 'Chutney' } ]
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

// Sample menu data for both messes and all days
const menuData = {
  sannasi: {
    monday:    { breakfast: ["Sweet", "Bread,Butter,Jam", "Idly", "Sambar", "Spl Chutney", "Poori", "Aloo Dal Masala", "Tea/Coffee/Milk", "Boiled Egg", "Banana"], lunch: ["Chappathi", "Chapp kasa", "Jeera Pulao", "Steamed Rice", "Masala Sambhar", "Bagara Dal", "Mix veg Usili", "Lemon rasam", "Pickle","Butter Milk","Fryums"], snacks: ["Pav Bajji", "Tea/Coffee"], dinner: ["Punjabi paratha", "Rajma Makkan wala", "Dosa","Idli podi","Oil","Special Chutney","Steamed rice","Vegetable dal","Rasam","Pickle","Fryums","Veg-Salad","**Mutton Gravy**"] },
    tuesday:   { breakfast: ["Bread,Butter,Jam","Ghee Pongal", "Vada", "Veg kosthu","Coconut chutney","Poha","Mint chutney","Masala Omlet",], lunch: ["Sweet","Poori","Mattar Ghughni","Variety rice","Steamed rice","Sambhar","Dal Lasooni","Tomato","Rasam","Gobi-65/Bhinidi Jaipuri","Fryums","Butter","Butter milk","Pickle"], snacks: ["Boiled Peanut/Black channa sundal", "Tea/Coffee"], dinner: ["Chappathi", "Mixveg kurma", "Friedrice/Noodles","Manchurian Dry/Crispy Veg","Steamed Rice","Rasam", "Dal fry","Pickle", "Fryums", "Veg Salad", "Milk","spl fruits","**Chicken Gravy**"] },
    wednesday: { breakfast: ["Bread,Butter,Jam","Dosa", "Idly Podi", "Oil", "Arichuvita Sambhar","Chutney", "Chappathi","Aloo Rajma Masala", "Tea/Coffee/Milk","Banana"], lunch: ["Butter Roti", "Aloo Palak", "Peas Pulao", "Dal Makhni", "Kadai Veggies", "Steamed Rice", "Drumstick Brinjal", "Sambhar", "Garlic Rasam", "Butter milk", "Fryums"], snacks: ["Veg Puff", "Coffee/Tea"], dinner: ["Chappathi", "Steamed rice","Chicken Masala/Paneer Butter Masala", "Rasam","Pickle","Fryums","Veg Salad","**Chicken gravy**"] },
    thursday:  { breakfast: ["Bread,Butter,Jam","Chappathi", "Aloo Meal Maker Kasa", "Veg semiya Kichidi", "Coconut Chutney", "Boiled Egg", "Tea/Coffee/Milk"], lunch: ["Luchi", "Kashmiri Dum Aloo", "Onion Pulao", "Steamed Rice", "Mysore Dal Fry","Kadai Pakoda", "Pepper Rasam", "Poriyal", "Pickle", "Fryums", "Butter Milk"], snacks: ["Pani Puri/Chunda Nasta", "Coffee/Tea"], dinner: ["Ghee Pulao/Kaju Pulao(Basmati Rice)", "Chappathi", "Muttar Panner", "Steamed Rice", "Tadka Dal", "Rasam", "Aloo Peanut Masala", "Fryums","Milk", "Pickle","veg Salad","**Mutton Gravy**"] },
    friday:    { breakfast: ["Bread,Butter,Jam","Podi Dosa", "Idly Podi", "Oil", "Chilli Sambar", "Chutney", "Chappathi", "Muttar Masala", "Tea/Coffee/Milk", "Boiled Egg", "Banana"], lunch: ["Dry Jamun/Bread Halwa", "Veg Biryani", "Mix Raitha", "Bisbelabath", "Curd Rice", "Steamed Rice", "Tomato Rasam", "Aloo Gobi Adarki","Moongdal Tadka", "Pickle", "Fryums"], snacks: ["Bonda/Vada", "Chutney","Coffee/Tea"], dinner: ["Chole Bhatura","Steamed Rice","Tomato dal","Sambha Rava Upma","Coconut Chutney","Rasam","Cabbage Poriyal","Pickle","Fryums","Veg salad","Milk","**Chicken Gravy**"] },
    saturday:  { breakfast: ["Bread,Butter,Jam","Chappathi", "Veg Khurma", "Idiyappam(Lemon/Masala)","Coconut Chutney", "Tea/Coffee/Milk", "Boiled Egg"], lunch: ["Poori", "Dal Aloo Masala", "Veg Pulao", "Steamed Rice", "Punjabi Dal Tadka","Bhindi Do Pyasa", "Kara Kuzhambu", "Kootu", "Jeera Rasam", "Pickle", "Special Fryums","Butter Milk"], snacks: ["Cake/Brownie", "Coffee/Tea"], dinner: ["Sweet", "Malabar Paratha", "Meal maker Curry", "Mix Vegetable Sabji", "Steamed Rice","Dal Makhini","Rasam", "Idli","Idli Podi","Sambhar", "Oil", "Fryums", "Pickle", "Veg Salad","**Fish Gravy**"] },
    sunday:    { breakfast: ["Bread,Butter,Jam", "Chole Puri", "Veg Upma", "Coconut Chutney","Tea/Coffee/Milk"], lunch: [ "Chappathi", "Chicken (Pepper/Kadai)","Panner Butter Masala/Kadai Panner", "Dal Dhadka", "Mint Pulao", "Steamed Rice", "Garlic Rasam", "Poriyal", "Pickle","Butter Milk", "Fryums","**Chicken Gravy**"], snacks: ["Corn/Bajji","Chutney", "Coffee/Tea"], dinner: ["Variety Stuffing Paratha","Curd", "Steamed Rice", "Hara Moong Dal Tadka", "Kathamba Sambhar", "Poriyal", "Rasam", "Pickle", "Fryums","Veg Salad", "Milk","Ice cream","**Chicken Gravy**"] },
  },
  mblock: {
    monday:    { breakfast: ["Bread,Butter,Jam", "Pongal", "Sambar", "Coconut Chutney","Vada", "Chappathi", "Soya Aloo Kasha", "Tea/Coffee/Milk", "Banana"], lunch: ["Mint Chappathi", "Black Channa Masala", "Mutter Pulao", "Dal Makhni", "Steamed Rice", "Arachivitta Sambar", "Keerai Kootu", "Rasam","Buttermilk", "Fryums", "Pickle"], snacks: ["Samosa/Veg Spring Roll", "Tea/Lemon Juice/Milk", "Bread/Butter/Jam"], dinner: ["Chappathi", "Tomato Dal", "Idli", "Chutney", "Sambar", "Idli Podi","Oil", "Steamed Rice", "Rasam", "Buttermilk", "Pickle", "Salad", "Milk", "**Fish Gravy**"] },
    tuesday:   { breakfast: ["Bread,Butter,Jam", "Poori", "Aloo Masala","Veg Rava Kitchadi", "Sambar", "Chutney", "Tea/Coffee/Milk", "Banana"], lunch: ["Payasam", "Chappathi", "White Peas Curry", "Jeera Pulao", "Dal Fry","Steamed Rice", "Kara Kuzhambu", "Rasam", "Cabbage Kootu","Buttermilk", "Fryums", "Pickle"], snacks: ["Pani Pori/Pav Bhaji", "Tea/Coffee/Milk", "Bread/Butter/Jam"], dinner: ["Millet Chappathi", "Black Channa Masala", "Dosa", "Sambar", "Chutney", "Idli Podi", "Oil", "Steamed Rice", "Rasam", "Buttermilk", "Salad", "Pickle","Milk", "**Mutton Kulambu**"] },
    wednesday: { breakfast: ["Bread,Butter,Jam","Idiyappam", "Vada Curry/Veg Stew","Mint Chutney", "Poha", "Tea/Coffee/Milk", "Banana"], lunch: ["Chappathi", "Rajma Masala", "Variety Rice", "Curd Rice", "Urulai Kara Masala", "Steamed Rice", "Rasam", "Appalam", "Pickle"], snacks: ["Bakery Snacks", "Tea/Coffee/Milk", "Bread/Butter/Jam"], dinner: ["Chappathi", "Paneer Butter Masala", "Steamed Rice", "Sambar", "Jeera Rasam","Buttermilk", "Pickle", "Milk", "**Chicken Gravy/Chicken Biryani**"] },
    thursday:  { breakfast: ["Bread,Butter,Jam","Idli", "Groundnut Chutney", "Sambar",  "Chappathi", "White Peas Masala", "Tea/Coffee/Milk", "Banana"], lunch: ["Sweet Pongal/Boondhi", "Beetroot Chappathi", "Gobi Capsicum", "Dal Fry","Veg Pulao", "Steamed Rice", "Karakulambu", "Keerai Kootu", "Rasam","Buttermilk", "Fryums", "Pickle"], snacks: ["Navadhaniya Sundal", "Tea/Coffee/Milk", "Bread/Butter/Jam"], dinner: ["Chole Poori", "Channa Masala", "Dosa", "Sambar", "Chutney", "Steamed Rice", "Rasam", "Buttermilk", "Onion Salad", "Pickle", "Milk","**Cup Ice Cream**", "**Chicken Gravy**"] },
    friday:    { breakfast: ["Bread,Butter,Jam","Chappathi", "Channa Dal", "Kal Dosa", "Sambar", "Chutney", "Omelette", "Tea/Coffee/Milk", "Banana", "Idli Podi", "Oil"], lunch: ["Chappathi", "Dal Tadka", "Peas Pulao", "Spinach Aloo", "Steamed Rice","Sambar", "Mix Veg Poriyal", "Rasam", "Buttermilk", "Fryums", "Pickle"], snacks: ["Bajji/Mysore Bonda", "Chutney", "Tea/Rose Milk", "Bread/Butter/Jam"], dinner: ["Veg Soup", "Chappathi", "Veg Manchurian Gravy", "Fried Rice/Noodles", "Dal Fry", "Steamed Rice", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Chicken Gravy**"] },
    saturday:  { breakfast: ["Bread,Butter,Jam", "Aloo Paratha", "Curd", "Idli", "Sambar","Groundnut Chutney", "Tea/Coffee/Milk", "Banana", "Boiled Egg"], lunch: ["Gulab Jamun/Millet Payasam", "Chappathi", "Meal Maker Curry","Veg Biryani", "Raitha", "Curd Rice", "Steamed Rice", "Rasam","Keerai Kootu", "Fryums", "Pickle"], snacks: ["Cake Variety", "Tea/Coffee/Milk", "Bread/Butter/Jam"], dinner: ["Paratha", "Veg Salna", "Dosa", "Chutney", "Tiffin Sambar", "Idli Podi", "Oil", "Steamed Rice", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Mutton Gravy**"] },
    sunday:    { breakfast: ["Bread,Butter,Jam","Chole Bhature", "Chenna Masala", "Rava Upma","Coconut Chutney", "Sambar", "Tea/Coffee/Milk", "Seasonal Fruit"], lunch: ["Chappathi", "Chicken Gravy", "Paneer Mutter Kasa", "Sambar", "Steamed Rice","Dal Fry", "Rasam", "Poriyal", "Buttermilk", "Milk", "Pickle", "Fryums"], snacks: ["Peanut Sundal/Channa Sundal", "Tea/Coffee/Milk", "Bread/Butter/Jam"], dinner: ["Chappathi", "Mix Veg Curry", "Dal Fry", "Chicken Gravy", "Steamed Rice", "Kadamba Sambar", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Cone Ice Cream**"] },
  }
};

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
  const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const menuItems = menuData[selectedMess][dayKey][meal.name.toLowerCase()] || [];
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
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 shadow-md relative flex flex-col items-center">
        <h1 className="text-2xl font-extrabold tracking-wide drop-shadow">Messmate</h1>
        <p className="text-sm font-medium opacity-90">SRM Hostel Mess Menu</p>
        <div className="mt-1 text-base font-mono bg-white/20 rounded px-2 py-0.5 shadow inline-block tracking-widest">
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
      <main className="flex-1 flex flex-col items-center justify-start p-4 w-full max-w-md mx-auto pb-24">
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
          <div className="w-full bg-gray-200 rounded-3xl shadow-2xl p-8 mb-6 flex flex-col items-center border-4 border-blue-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-blue-700">{meal.name}</span>
              <span className="text-sm text-gray-600">{formatTime(meal.start.hour, meal.start.min)} – {formatTime(meal.end.hour, meal.end.min)}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full max-h-64 overflow-y-auto pr-2">
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-gray-100 rounded-xl p-4 shadow-md hover:scale-105 transition text-xl font-semibold text-gray-800"
                >
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 py-2 w-full bg-white bg-opacity-80 backdrop-blur-sm fixed bottom-0 left-0 z-50">
        <div className="flex gap-3 mb-0.5">
          <a href="https://instagram.com/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 text-base"><FaInstagram /></a>
          <a href="https://github.com/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-gray-900 text-base"><FaGithub /></a>
          <a href="https://linkedin.com/in/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 text-base"><FaLinkedin /></a>
        </div>
        <div className="flex items-center gap-1">
          <span>Made with</span>
          <span className="text-red-500 text-sm">♥</span>
          <span>Gowthamrdyy</span>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
