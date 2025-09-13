import { renderHook, act } from '@testing-library/react';
import useAppStore from '../useAppStore';
import { THEMES } from '../../utils/constants';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('useAppStore', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.theme).toBe(THEMES.LIGHT);
    expect(result.current.selectedMess).toBe('sannasi');
    expect(result.current.compactMode).toBe(false);
    expect(result.current.favorites).toEqual([]);
  });

  test('should toggle theme', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe(THEMES.DARK);
  });

  test('should set selected mess', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setSelectedMess('mblock');
    });
    
    expect(result.current.selectedMess).toBe('mblock');
  });

  test('should toggle compact mode', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.toggleCompactMode();
    });
    
    expect(result.current.compactMode).toBe(true);
  });

  test('should add and remove favorites', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.addToFavorites('Dosa');
    });
    
    expect(result.current.favorites).toContain('Dosa');
    
    act(() => {
      result.current.removeFromFavorites('Dosa');
    });
    
    expect(result.current.favorites).not.toContain('Dosa');
  });

  test('should toggle favorite', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.toggleFavorite('Idli');
    });
    
    expect(result.current.favorites).toContain('Idli');
    
    act(() => {
      result.current.toggleFavorite('Idli');
    });
    
    expect(result.current.favorites).not.toContain('Idli');
  });

  test('should set rating', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setRating('Sambar', 5);
    });
    
    expect(result.current.ratings['Sambar']).toBe(5);
  });

  test('should navigate meals', () => {
    const { result } = renderHook(() => useAppStore());
    
    const initialMealIndex = result.current.mealNavigation.mealIndex;
    
    act(() => {
      result.current.navigateToNextMeal();
    });
    
    expect(result.current.mealNavigation.isLive).toBe(false);
    expect(result.current.mealNavigation.mealIndex).not.toBe(initialMealIndex);
  });

  test('should go live', () => {
    const { result } = renderHook(() => useAppStore());
    
    // First navigate away from live
    act(() => {
      result.current.navigateToNextMeal();
    });
    
    expect(result.current.mealNavigation.isLive).toBe(false);
    
    // Then go back to live
    act(() => {
      result.current.goLive();
    });
    
    expect(result.current.mealNavigation.isLive).toBe(true);
  });
});