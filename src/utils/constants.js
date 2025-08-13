// App Configuration Constants
export const APP_CONFIG = {
  name: 'Messmate',
  fullName: 'Messmate - SRM Hostel Mess Menu',
  description: 'SRM Hostel Mess Menu',
  tagline: 'Modern hostel mess menu application for SRM students',
  version: '2.0.0',
};

// Theme Constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Animation Constants
export const ANIMATIONS = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_OUT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    SPRING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Breakpoints (matching TailwindCSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};

// PWA Constants
export const PWA_CONFIG = {
  CACHE_NAME: 'messmate-v2',
  CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Notification Messages
export const NOTIFICATION_MESSAGES = {
  MEAL_TIME: [
    "Hey gorgeous! Your {meal} is ready and looking fine 😍",
    "{meal} is here and it's absolutely stunning! 💅",
    "Babe, your {meal} is served with extra love 💕",
    "Darling, {meal} time! Don't keep me waiting 😘",
    "Sweet cheeks, your {meal} is hot and ready! 🔥",
    "Honey, {meal} just winked at you from the mess 😉",
    "Sugar, your {meal} is calling for some quality time 💋",
    "Cutie, {meal} is dressed to impress today! ✨",
    "Baby, {meal} wants to be your main character 🌟",
    "Sweetheart, {meal} is flirting with your taste buds 😋",
    "Love, {meal} is ready for your first bite 💖",
    "Gorgeous, {meal} has been waiting just for you! 🥰",
    "Bae, {meal} is looking absolutely irresistible 😍",
    "Sunshine, your {meal} date is ready! ☀️",
    "Angel, {meal} is here to steal your heart 💘",
    "Hottie, {meal} is serving looks and flavor! 🔥",
    "Cutie pie, {meal} wants to make you smile 😊",
    "Beautiful, {meal} is your perfect match today 💕",
  ],
  MENU_UPDATE: [
    "Tomorrow's menu is here and it's a total catch! 😍",
    "New menu alert! Tomorrow's lineup is absolutely gorgeous 💅",
    "Babe, tomorrow's menu just dropped and it's fire! 🔥",
    "Honey, peek at tomorrow's menu - it's a whole mood! ✨",
    "Sweet thing, tomorrow's treats are here to seduce you 😘",
    "Darling, tomorrow's menu is flirting with perfection! 💋",
    "Cutie, tomorrow's lineup wants to be your new obsession 💖",
    "Sugar, tomorrow's menu is dressed to kill! 💅",
  ],
  FAVORITES: [
    "Added to your heart's desire list! 💕",
    "Bookmarked this cutie for later! 😘",
    "Your taste buds said 'yes please!' ✨",
    "This beauty is now your favorite! 💖",
    "Saved this hottie to your collection! 🔥",
    "Your crush list just got updated! 😍",
    "This dish stole your heart! 💘",
  ],
  RATING: [
    "Thanks babe, your opinion is everything! 💕",
    "Your feedback makes my day, gorgeous! ✨",
    "Sweet of you to share your thoughts! 😘",
    "You're helping others find their perfect match! 💖",
    "Your rating is absolutely precious! 🥰",
  ],
};

// Food Emojis Mapping with priority order (more specific first)
export const FOOD_EMOJIS = {
  // Specific dishes first (to avoid conflicts)
  'ice cream': '🍦',
  'boiled egg': '🥚',
  'masala omlet': '🍳',
  'omelette': '🍳',
  'veg biryani': '🍛',
  'chicken biryani': '🍛',
  'mutton biryani': '🍛',
  'fried rice': '🍛',
  'variety rice': '🍛',
  'jeera rice': '🍛',
  'curd rice': '🍚',
  'steamed rice': '🍚',
  'veg curry': '🍛',
  'chicken curry': '🍗',
  'chicken gravy': '🍗',
  'mutton gravy': '🍖',
  'fish gravy': '🐟',
  'paneer butter masala': '🧀',
  'dal makhni': '🍲',
  'dal fry': '🍲',
  'dal tadka': '🍲',
  'mix veg': '🥗',
  'veg salad': '🥗',
  'onion salad': '🥗',
  'bread butter jam': '🍞',
  'tea coffee': '☕',
  'pani puri': '🥟',
  'chole bhature': '🫓',
  'aloo paratha': '🫓',
  'mint chutney': '🥄',
  'coconut chutney': '🥄',
  'groundnut chutney': '🥄',
  
  // Individual items
  'bread': '🍞',
  'butter': '🧈',
  'jam': '🍯',
  'idli': '🥞',
  'dosa': '🥞',
  'sambar': '🍲',
  'sambhar': '🍲',
  'chutney': '🥄',
  'poori': '🫓',
  'upma': '🍚',
  'pongal': '🍚',
  'vada': '🍩',
  'tea': '☕',
  'coffee': '☕',
  'milk': '🥛',
  'egg': '🥚',
  'banana': '🍌',
  
  // Main dishes
  'rice': '🍚',
  'chapathi': '🫓',
  'chappathi': '🫓',
  'roti': '🫓',
  'paratha': '🫓',
  'dal': '🍲',
  'curry': '🍛',
  'paneer': '🧀',
  'chicken': '🍗',
  'mutton': '🍖',
  'fish': '🐟',
  'biryani': '🍛',
  'pulao': '🍛',
  'rasam': '🍲',
  'pickle': '🥒',
  'curd': '🥛',
  'raitha': '🥗',
  'salad': '🥗',
  'fryums': '🍘',
  'appalam': '🍘',
  
  // Snacks
  'samosa': '🥟',
  'bajji': '🍤',
  'bonda': '🍩',
  'puff': '🥐',
  'cake': '🍰',
  'sweet': '🍰',
  'payasam': '🍮',
  'jamun': '🍮',
  'halwa': '🍮',
  
  // Vegetables and vegetarian items (be more specific to avoid conflicts)
  'mix veg usili': '🥗',
  'veg kosthu': '🥗',
  'veg khurma': '🥗',
  'veg kurma': '🥗',
  'veg stew': '🥗',
  'veg manchurian': '🥗',
  'veg salna': '🥗',
  'aloo': '🥔',
  'potato': '🥔',
  'gobi': '🥬',
  'cauliflower': '🥬',
  'cabbage': '🥬',
  'carrot': '🥕',
  'beans': '🫘',
  'peas': '🟢',
  'tomato': '🍅',
  'onion': '🧅',
  'spinach': '🥬',
  'palak': '🥬',
  'bhindi': '🥒',
  'brinjal': '🍆',
  'drumstick': '🥒',
  'keerai': '🥬',
  'kootu': '🥗',
  'poriyal': '🥗',
  'usili': '🥗',
  
  // Beverages
  'kashayam': '🍵',
  'juice': '🧃',
  'buttermilk': '🥛',
  
  // Default
  'default': '🍽️',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'messmate-theme',
  PREFERENCES: 'messmate-preferences',
  FAVORITES: 'messmate-favorites',
  RATINGS: 'messmate-ratings',
  LAST_VISIT: 'messmate-last-visit',
};