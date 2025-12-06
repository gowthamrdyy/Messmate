import { FOOD_EMOJIS } from '../constants';

// Simulate the emoji matching logic from MealCard
const getFoodEmoji = (item) => {
  const itemLower = item.toLowerCase().trim();
  
  // Remove common prefixes/suffixes and special characters
  const cleanItem = itemLower
    .replace(/\*\*/g, '') // Remove ** markers
    .replace(/\//g, ' ') // Replace / with space for better matching
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  // First, try exact matches for multi-word items
  const exactMatches = Object.entries(FOOD_EMOJIS).filter(([key]) => 
    key !== 'default' && cleanItem === key
  );
  if (exactMatches.length > 0) {
    return exactMatches[0][1];
  }
  
  // Then try phrase matches (for items like "paneer butter masala")
  const phraseMatches = Object.entries(FOOD_EMOJIS).filter(([key]) => 
    key !== 'default' && key.includes(' ') && cleanItem.includes(key)
  );
  if (phraseMatches.length > 0) {
    // Return the longest match (most specific)
    const longestMatch = phraseMatches.reduce((a, b) => a[0].length > b[0].length ? a : b);
    return longestMatch[1];
  }
  
  // Finally, try word-based matching (but be more careful)
  const words = cleanItem.split(' ');
  for (const word of words) {
    // Skip very short words that might cause false matches
    if (word.length < 3) continue;
    
    for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
      if (key === 'default') continue;
      
      // For single-word keys, match whole words only
      if (!key.includes(' ') && word === key) {
        return emoji;
      }
      
      // For multi-word keys, check if the item contains the key
      if (key.includes(' ') && cleanItem.includes(key)) {
        return emoji;
      }
    }
  }
  
  return FOOD_EMOJIS.default;
};

describe('Food Emoji Matching', () => {
  test('should match vegetarian items correctly', () => {
    expect(getFoodEmoji('Mix veg Usili')).toBe('🥗');
    expect(getFoodEmoji('Veg kosthu')).toBe('🥗');
    expect(getFoodEmoji('Veg Khurma')).toBe('🥗');
    expect(getFoodEmoji('Mix Vegetable Sabji')).toBe('🥗');
  });

  test('should match egg items correctly', () => {
    expect(getFoodEmoji('Boiled Egg')).toBe('🥚');
    expect(getFoodEmoji('Masala Omlet')).toBe('🍳');
    expect(getFoodEmoji('Omelette')).toBe('🍳');
  });

  test('should not confuse veg items with egg', () => {
    expect(getFoodEmoji('Mix veg Usili')).not.toBe('🥚');
    expect(getFoodEmoji('Veg kosthu')).not.toBe('🥚');
    expect(getFoodEmoji('Vegetable dal')).not.toBe('🥚');
  });

  test('should match specific dishes correctly', () => {
    expect(getFoodEmoji('Paneer Butter Masala')).toBe('🧀');
    expect(getFoodEmoji('Chicken Gravy')).toBe('🍗');
    expect(getFoodEmoji('Mutton Gravy')).toBe('🍖');
    expect(getFoodEmoji('Fish Gravy')).toBe('🐟');
  });

  test('should match rice varieties correctly', () => {
    expect(getFoodEmoji('Steamed Rice')).toBe('🍚');
    expect(getFoodEmoji('Curd Rice')).toBe('🍚');
    expect(getFoodEmoji('Variety Rice')).toBe('🍛');
    expect(getFoodEmoji('Fried Rice')).toBe('🍛');
  });

  test('should match bread items correctly', () => {
    expect(getFoodEmoji('Bread,Butter,Jam')).toBe('🍞');
    expect(getFoodEmoji('Chappathi')).toBe('🫓');
    expect(getFoodEmoji('Poori')).toBe('🫓');
  });

  test('should handle special characters and formatting', () => {
    expect(getFoodEmoji('**Chicken Gravy**')).toBe('🍗');
    expect(getFoodEmoji('Tea/Coffee')).toBe('☕');
    expect(getFoodEmoji('Friedrice/Noodles')).toBe('🍛');
  });

  test('should return default emoji for unknown items', () => {
    expect(getFoodEmoji('Unknown Food Item')).toBe('🍽️');
    expect(getFoodEmoji('Random Text')).toBe('🍽️');
  });
});