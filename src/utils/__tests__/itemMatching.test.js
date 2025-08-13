import { 
  normalizeItemName, 
  createItemKey, 
  areItemsSimilar, 
  hasSimilarFavorite, 
  getMatchingFavorite 
} from '../itemMatching';

describe('Item Matching Utilities', () => {
  describe('normalizeItemName', () => {
    test('should normalize item names correctly', () => {
      expect(normalizeItemName('**Butter Milk**')).toBe('butter milk');
      expect(normalizeItemName('Bread,Butter,Jam')).toBe('breadbutterjam');
      expect(normalizeItemName('  Tea/Coffee  ')).toBe('teacoffee');
    });

    test('should remove common words', () => {
      expect(normalizeItemName('Rice with Dal')).toBe('rice dal');
      expect(normalizeItemName('Bread and Butter')).toBe('bread butter');
    });
  });

  describe('createItemKey', () => {
    test('should create consistent keys for similar items', () => {
      expect(createItemKey('Butter Milk')).toBe('buttermilk');
      expect(createItemKey('Buttermilk')).toBe('buttermilk');
      expect(createItemKey('butter milk')).toBe('buttermilk');
    });

    test('should handle chapathi variations', () => {
      expect(createItemKey('Chappathi')).toBe('chapathi');
      expect(createItemKey('Chapati')).toBe('chapathi');
      expect(createItemKey('Chappati')).toBe('chapathi');
    });

    test('should handle rice variations', () => {
      expect(createItemKey('Steamed Rice')).toBe('rice');
      expect(createItemKey('Plain Rice')).toBe('rice');
      expect(createItemKey('White Rice')).toBe('rice');
    });
  });

  describe('areItemsSimilar', () => {
    test('should match similar items', () => {
      expect(areItemsSimilar('Butter Milk', 'Buttermilk')).toBe(true);
      expect(areItemsSimilar('Chappathi', 'Chapati')).toBe(true);
      expect(areItemsSimilar('Dal Fry', 'Dal Tadka')).toBe(true);
      expect(areItemsSimilar('Mix Veg', 'Mixed Vegetables')).toBe(true);
    });

    test('should not match different items', () => {
      expect(areItemsSimilar('Rice', 'Dal')).toBe(false);
      expect(areItemsSimilar('Dosa', 'Idli')).toBe(false);
      expect(areItemsSimilar('Tea', 'Coffee')).toBe(false);
    });
  });

  describe('hasSimilarFavorite', () => {
    test('should find similar favorites', () => {
      const favorites = ['Buttermilk', 'Chapati', 'Dal Fry'];
      
      expect(hasSimilarFavorite('Butter Milk', favorites)).toBe(true);
      expect(hasSimilarFavorite('Chappathi', favorites)).toBe(true);
      expect(hasSimilarFavorite('Dal Tadka', favorites)).toBe(true);
    });

    test('should not find non-similar items', () => {
      const favorites = ['Buttermilk', 'Chapati'];
      
      expect(hasSimilarFavorite('Rice', favorites)).toBe(false);
      expect(hasSimilarFavorite('Dosa', favorites)).toBe(false);
    });
  });

  describe('getMatchingFavorite', () => {
    test('should return matching favorite', () => {
      const favorites = ['Buttermilk', 'Chapati', 'Dal Fry'];
      
      expect(getMatchingFavorite('Butter Milk', favorites)).toBe('Buttermilk');
      expect(getMatchingFavorite('Chappathi', favorites)).toBe('Chapati');
      expect(getMatchingFavorite('Dal Tadka', favorites)).toBe('Dal Fry');
    });

    test('should return null for non-matching items', () => {
      const favorites = ['Buttermilk', 'Chapati'];
      
      expect(getMatchingFavorite('Rice', favorites)).toBe(null);
      expect(getMatchingFavorite('Dosa', favorites)).toBe(null);
    });
  });
});