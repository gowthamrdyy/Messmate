import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../useTheme';
import { THEMES, STORAGE_KEYS } from '../../utils/constants';

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
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  test('should initialize with light theme by default', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    expect(result.current.theme).toBe(THEMES.LIGHT);
  });

  test('should toggle theme from light to dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe(THEMES.DARK);
  });

  test('should toggle theme from dark to light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // First toggle to dark
    act(() => {
      result.current.toggleTheme();
    });
    
    // Then toggle back to light
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe(THEMES.LIGHT);
  });

  test('should set theme directly', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    expect(result.current.theme).toBe(THEMES.DARK);
  });

  test('should save theme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, THEMES.DARK);
  });

  test('should load saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(THEMES.DARK);
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    expect(result.current.theme).toBe(THEMES.DARK);
  });

  test('should apply theme classes to document', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme(THEMES.DARK);
    });
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe(THEMES.DARK);
  });
});