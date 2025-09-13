/**
 * Normalize item names for better matching
 * @param {string} item - Food item name
 * @returns {string} - Normalized item name
 */
export const normalizeItemName = (item) => {
  return item
    .toLowerCase()
    .trim()
    .replace(/\*\*/g, '') // Remove ** markers
    .replace(/[^\w\s]/g, '') // Remove special characters except spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/\b(the|and|or|with)\b/g, '') // Remove common words
    .trim();
};

/**
 * Create a simplified key for item matching
 * @param {string} item - Food item name
 * @returns {string} - Simplified key for matching
 */
export const createItemKey = (item) => {
  const normalized = normalizeItemName(item);
  
  // Handle common variations
  const variations = {
    'buttermilk': 'buttermilk',
    'butter milk': 'buttermilk',
    'chappathi': 'chapathi',
    'chappati': 'chapathi',
    'chapati': 'chapathi',
    'sambhar': 'sambar',
    'sambhaar': 'sambar',
    'tea coffee': 'tea',
    'coffee tea': 'tea',
    'steamed rice': 'rice',
    'plain rice': 'rice',
    'white rice': 'rice',
    'basmati rice': 'rice',
    'jeera rice': 'rice',
    'fried rice': 'friedrice',
    'veg biryani': 'biryani',
    'chicken biryani': 'biryani',
    'mutton biryani': 'biryani',
    'paneer butter masala': 'paneer',
    'paneer masala': 'paneer',
    'kadai paneer': 'paneer',
    'dal fry': 'dal',
    'dal tadka': 'dal',
    'dal makhni': 'dal',
    'toor dal': 'dal',
    'moong dal': 'dal',
    'masala dal': 'dal',
    'mix veg': 'mixveg',
    'mixed vegetables': 'mixveg',
    'vegetable curry': 'mixveg',
    'veg curry': 'mixveg',
    'coconut chutney': 'chutney',
    'mint chutney': 'chutney',
    'groundnut chutney': 'chutney',
    'tomato chutney': 'chutney',
    'bread butter jam': 'bread',
    'bread jam': 'bread',
    'bread butter': 'bread',
  };
  
  // Check for exact matches in variations
  if (variations[normalized]) {
    return variations[normalized];
  }
  
  // Extract key words for fuzzy matching
  const words = normalized.split(' ').filter(word => word.length > 2);
  const keyWords = words.slice(0, 2).join(' '); // Take first 2 significant words
  
  return keyWords || normalized;
};

/**
 * Check if two items are similar enough to be considered the same
 * @param {string} item1 - First item name
 * @param {string} item2 - Second item name
 * @returns {boolean} - True if items are similar
 */
export const areItemsSimilar = (item1, item2) => {
  const key1 = createItemKey(item1);
  const key2 = createItemKey(item2);
  
  // Exact match
  if (key1 === key2) return true;
  
  // Check if one contains the other (for partial matches)
  if (key1.length > 3 && key2.length > 3) {
    return key1.includes(key2) || key2.includes(key1);
  }
  
  return false;
};

/**
 * Find if an item has a similar favorite
 * @param {string} item - Item to check
 * @param {string[]} favorites - Array of favorite items
 * @returns {boolean} - True if item has a similar favorite
 */
export const hasSimilarFavorite = (item, favorites) => {
  return favorites.some(favorite => areItemsSimilar(item, favorite));
};

/**
 * Get the matching favorite for an item
 * @param {string} item - Item to check
 * @param {string[]} favorites - Array of favorite items
 * @returns {string|null} - Matching favorite or null
 */
export const getMatchingFavorite = (item, favorites) => {
  return favorites.find(favorite => areItemsSimilar(item, favorite)) || null;
};