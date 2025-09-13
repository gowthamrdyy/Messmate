import { renderHook, act } from '@testing-library/react';
import { useSwipeGestures, useMealSwipeNavigation, useSwipeCapable } from '../useSwipeGestures';

// Mock react-swipeable
jest.mock('react-swipeable', () => ({
  useSwipeable: jest.fn((config) => {
    // Return mock handlers that can be called in tests
    return {
      onSwipeStart: config.onSwipeStart,
      onSwiping: config.onSwiping,
      onSwipedLeft: config.onSwipedLeft,
      onSwipedRight: config.onSwipedRight,
      onTouchEndOrOnMouseUp: config.onTouchEndOrOnMouseUp,
    };
  }),
}));

describe('useSwipeGestures', () => {
  const mockOnSwipeLeft = jest.fn();
  const mockOnSwipeRight = jest.fn();

  beforeEach(() => {
    mockOnSwipeLeft.mockClear();
    mockOnSwipeRight.mockClear();
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useSwipeGestures({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
      })
    );

    expect(result.current.isSwipeActive).toBe(false);
    expect(result.current.swipeDirection).toBe(null);
    expect(result.current.swipeProgress).toBe(0);
  });

  test('should provide swipe handlers', () => {
    const { result } = renderHook(() =>
      useSwipeGestures({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
      })
    );

    expect(result.current.swipeHandlers).toBeDefined();
    expect(typeof result.current.swipeHandlers.onSwipeStart).toBe('function');
    expect(typeof result.current.swipeHandlers.onSwiping).toBe('function');
  });
});

describe('useMealSwipeNavigation', () => {
  const mockOnNext = jest.fn();
  const mockOnPrevious = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockOnPrevious.mockClear();
  });

  test('should initialize with meal navigation defaults', () => {
    const { result } = renderHook(() =>
      useMealSwipeNavigation({
        onNext: mockOnNext,
        onPrevious: mockOnPrevious,
      })
    );

    expect(result.current.feedbackVisible).toBe(false);
    expect(result.current.feedbackDirection).toBe(null);
    expect(result.current.swipeHandlers).toBeDefined();
  });

  test('should provide feedback state', () => {
    const { result } = renderHook(() =>
      useMealSwipeNavigation({
        onNext: mockOnNext,
        onPrevious: mockOnPrevious,
      })
    );

    expect(typeof result.current.feedbackVisible).toBe('boolean');
    expect(result.current.feedbackDirection).toBe(null);
  });
});

describe('useSwipeCapable', () => {
  test('should detect touch capability', () => {
    // Mock touch support
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      value: true,
    });

    const { result } = renderHook(() => useSwipeCapable());
    expect(result.current).toBe(true);
  });

  test('should detect no touch capability', () => {
    // Mock no touch support
    delete window.ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 0,
    });

    const { result } = renderHook(() => useSwipeCapable());
    expect(result.current).toBe(false);
  });
});