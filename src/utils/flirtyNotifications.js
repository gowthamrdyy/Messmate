/**
 * Flirty Food Notifications for Messmate
 * Inspired by Zomato and Swiggy's playful notification style
 */

// Food emojis for different meal types
const FOOD_EMOJIS = {
  breakfast: ['🥞', '🍳', '🥐', '🥖', '🥨', '🥯', '🧀', '🥚', '🥛', '☕', '🍵', '🥣', '🥗'],
  lunch: ['🍚', '🍜', '🍝', '🍛', '🥘', '🍲', '🥣', '🥗', '🥙', '🌮', '🌯', '🥪', '🍕', '🍔'],
  dinner: ['🍽️', '🥘', '🍲', '🥣', '🥗', '🥙', '🌮', '🌯', '🥪', '🍕', '🍔', '🍟', '🍖', '🍗'],
  snacks: ['🍿', '🍪', '🍩', '🍰', '🧁', '🍦', '🍨', '🍧', '🍡', '🍢', '🥨', '🥯', '🥐', '🍞']
};

// Flirty pickup lines for different scenarios
const FLIRTY_PICKUP_LINES = {
  mealTime: [
    "Hungry? We've got something hot waiting for you! 🔥",
    "Your food is getting lonely without you! Come say hi! 👋",
    "We made this especially for you, don't keep it waiting! 💕",
    "Your taste buds are calling, and we're answering! 📞",
    "Time to treat yourself to something delicious! ✨",
    "We've got the perfect match for your appetite! 💘",
    "Your food is ready to sweep you off your feet! 👠",
    "Hunger is the best sauce, but we've got better ones! 😋",
    "Your stomach is growling, and we're listening! 🎵",
    "Ready for a culinary adventure? Let's go! 🚀"
  ],
  menuUpdate: [
    "New items just dropped! Your taste buds will thank us! 🎉",
    "We've got some surprises for you today! 🎁",
    "Fresh menu alert! Time to explore new flavors! 🌟",
    "Your favorites got some new friends! Meet them! 👥",
    "We've upgraded your options! Spoiled for choice! 😍",
    "New additions that will make your day! ✨",
    "Fresh from our kitchen to your heart! 💖",
    "We've been cooking up something special! 👨‍🍳",
    "Your menu just got a makeover! 💄",
    "New flavors waiting to dance on your tongue! 💃"
  ],
  specialMeal: [
    "Special treat alert! You deserve this! 👑",
    "We've got something extra special for you today! 🌟",
    "Your VIP meal is ready! Time to indulge! 💎",
    "Special occasion calls for special food! 🎊",
    "We've pulled out all the stops for you! 🎭",
    "Today's menu is extra fancy, just like you! ✨",
    "Special items that will make you feel special! 💫",
    "We've got the good stuff today! Treat yourself! 🎁",
    "Your taste buds are in for a treat! 🍭",
    "Special meal, special you! Let's celebrate! 🎉"
  ],
  favorites: [
    "Your favorites are back! Reunited and it feels so good! 💕",
    "Your beloved dishes are waiting for you! 💝",
    "Your favorites miss you! Come back to them! 💌",
    "The dishes you love are calling your name! 📢",
    "Your favorites are ready for a reunion! 🤗",
    "Time to visit your old friends (the food kind)! 👥",
    "Your favorites are getting impatient! ⏰",
    "Your taste buds' best friends are here! 👯‍♀️",
    "Your favorites are ready to spoil you! 🎁",
    "Your comfort food is waiting to comfort you! 🤗"
  ],
  test: [
    "Testing, testing! Can you hear our deliciousness? 🎤",
    "This is a test notification, but our food is real! 🧪",
    "Test notification with real flavor! 🎯",
    "Testing our connection to your taste buds! 🔗",
    "This is just a test, but our food is the real deal! ✅",
    "Testing notifications, serving deliciousness! 🍽️",
    "Test notification with authentic taste! 🎨",
    "Testing our foodie communication! 📡",
    "This is a test, but our love for food is real! 💖",
    "Testing notifications, delivering happiness! 🚚"
  ]
};

// Food puns and jokes
const FOOD_PUNS = [
  "You're the butter to my bread! 🧈",
  "You're the cheese to my macaroni! 🧀",
  "You're the salt to my pepper! 🧂",
  "You're the ketchup to my fries! 🍟",
  "You're the milk to my cookies! 🥛",
  "You're the honey to my tea! 🍯",
  "You're the cream to my coffee! ☕",
  "You're the sauce to my pasta! 🍝",
  "You're the jam to my toast! 🍞",
  "You're the sugar to my dessert! 🍰"
];

// Meal-specific messages
const MEAL_MESSAGES = {
  breakfast: [
    "Breakfast is served! Time to start your day deliciously! ☀️",
    "Good morning! Your breakfast is ready and waiting! 🌅",
    "Breakfast time! The most important meal of the day is here! 💪",
    "Start your day with something as sweet as you! 🍯",
    "Your breakfast is hot and ready! Come get it! 🔥",
    "Breakfast is ready! Let's make this morning amazing! 🌞",
    "Your morning fuel is served! Time to conquer the day! ⚡",
    "Breakfast is ready! Come get your daily dose of happiness! 😊",
    "Good morning! Your breakfast is ready to spoil you! 👑",
    "Breakfast is served! Your morning feast awaits! 🍽️"
  ],
  lunch: [
    "Lunch is served! Time to treat yourself to something amazing! 🍽️",
    "Lunch time! Your midday fuel is ready! 📞",
    "Lunch is ready! Let's make this afternoon delicious! 🌤️",
    "Your lunch is ready to power you through the day! ⚡",
    "Lunch is served! Your food is waiting for you! ⏰",
    "Lunch time! Your taste buds are in for a treat! 🎁",
    "Lunch is ready! Come get your midday happiness! 😋",
    "Your lunch is served! Ready to make your day better! ✨",
    "Lunch time! Let's turn this day around! 🔄",
    "Your lunch is ready! Your afternoon hero awaits! 🦸‍♀️"
  ],
  dinner: [
    "Dinner is served! Let's end this day on a delicious note! 🌙",
    "Dinner time! Your evening feast is ready! ✨",
    "Dinner is ready! Time to unwind with good food! 🍷",
    "Your dinner is served! Ready to be the highlight of your day! 🌟",
    "Dinner time! Let's make this night memorable! 🌃",
    "Your dinner is ready! Time to comfort your soul! 🤗",
    "Dinner is served! Time to relax and enjoy! 😌",
    "Your dinner is ready! Your perfect evening companion! 👥",
    "Dinner time! Let's make this meal count! 💫",
    "Your dinner is served! Your night's best friend awaits! 👯‍♀️"
  ],
  snacks: [
    "Snack time! Your cravings are satisfied! 🍿",
    "Snacks are served! Your taste buds are in for a treat! 🎢",
    "Your snacks are ready! Time to satisfy those cravings! 😋",
    "Snack time! Your little treat is ready! 🎁",
    "Your snacks are served! Your mood booster is here! ⚡",
    "Snack time! Let's make this moment delicious! ✨",
    "Your snacks are ready! Your comfort food awaits! 🤗",
    "Snack time! Your happiness is served! 😊",
    "Your snacks are ready! Your day's highlight is here! 🌟",
    "Snack time! Let's make this break count! 💪"
  ]
};

/**
 * Get a random item from an array
 */
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get a random food emoji for a meal type
 */
const getRandomFoodEmoji = (mealType) => {
  const emojis = FOOD_EMOJIS[mealType] || FOOD_EMOJIS.lunch;
  return getRandomItem(emojis);
};

/**
 * Generate a flirty meal time notification
 */
export const generateMealTimeNotification = (mealName, mealTime, menuItems = []) => {
  const mealType = mealName.toLowerCase();
  const foodEmoji = getRandomFoodEmoji(mealType);
  const pickupLine = getRandomItem(FLIRTY_PICKUP_LINES.mealTime);
  const mealMessage = getRandomItem(MEAL_MESSAGES[mealType] || MEAL_MESSAGES.lunch);
  
  return {
    title: `${foodEmoji} ${mealName} Time!`,
    body: `${mealMessage} ${pickupLine}`,
    tag: `meal-${mealType}`,
    data: {
      type: 'meal_reminder',
      meal: mealName,
      menuItems: menuItems,
      mealTime: mealTime
    }
  };
};

/**
 * Generate a flirty menu update notification
 */
export const generateMenuUpdateNotification = (messName, dayName, changes = []) => {
  const pickupLine = getRandomItem(FLIRTY_PICKUP_LINES.menuUpdate);
  const foodEmoji = getRandomFoodEmoji('lunch');
  
  return {
    title: `${foodEmoji} Menu Updated - ${messName}`,
    body: `${pickupLine} New items for ${dayName}!`,
    tag: 'menu_update',
    data: {
      type: 'menu_update',
      mess: messName,
      day: dayName,
      changes: changes
    }
  };
};

/**
 * Generate a flirty special meal notification
 */
export const generateSpecialMealNotification = (mealName, specialItems = []) => {
  const pickupLine = getRandomItem(FLIRTY_PICKUP_LINES.specialMeal);
  const foodEmoji = getRandomFoodEmoji('dinner');
  
  return {
    title: `${foodEmoji} Special ${mealName}!`,
    body: `${pickupLine} ${specialItems.join(', ')}`,
    tag: 'special_meal',
    data: {
      type: 'special_meal',
      meal: mealName,
      items: specialItems
    }
  };
};

/**
 * Generate a flirty favorites notification
 */
export const generateFavoritesNotification = (mealName, favoriteItems = []) => {
  const pickupLine = getRandomItem(FLIRTY_PICKUP_LINES.favorites);
  const foodEmoji = getRandomFoodEmoji('lunch');
  
  return {
    title: `${foodEmoji} Your Favorites Are Back!`,
    body: `${pickupLine} ${favoriteItems.join(', ')}`,
    tag: 'favorites',
    data: {
      type: 'favorites',
      meal: mealName,
      items: favoriteItems
    }
  };
};

/**
 * Generate a flirty test notification
 */
export const generateTestNotification = () => {
  const pickupLine = getRandomItem(FLIRTY_PICKUP_LINES.test);
  const foodEmoji = getRandomFoodEmoji('snacks');
  
  return {
    title: `${foodEmoji} Test Notification`,
    body: pickupLine,
    tag: 'test_notification',
    data: {
      type: 'test',
      timestamp: new Date().toISOString()
    }
  };
};

/**
 * Generate a random food pun
 */
export const generateFoodPun = () => {
  return getRandomItem(FOOD_PUNS);
};

/**
 * Generate a custom flirty notification
 */
export const generateCustomNotification = (type, data = {}) => {
  switch (type) {
    case 'meal_time':
      return generateMealTimeNotification(data.mealName, data.mealTime, data.menuItems);
    case 'menu_update':
      return generateMenuUpdateNotification(data.messName, data.dayName, data.changes);
    case 'special_meal':
      return generateSpecialMealNotification(data.mealName, data.specialItems);
    case 'favorites':
      return generateFavoritesNotification(data.mealName, data.favoriteItems);
    case 'test':
      return generateTestNotification();
    default:
      return generateTestNotification();
  }
};

export default {
  generateMealTimeNotification,
  generateMenuUpdateNotification,
  generateSpecialMealNotification,
  generateFavoritesNotification,
  generateTestNotification,
  generateFoodPun,
  generateCustomNotification
};