import { renderHook, act } from '@testing-library/react';
import { useNotifications, useMealTimeNotifications } from '../useNotifications.jsx';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  __esModule: true,
  default: jest.fn(),
}));

// Mock constants
jest.mock('../../utils/constants', () => ({
  NOTIFICATION_MESSAGES: {
    MEAL_TIME: [
      'Your {meal} is hot and waiting! 🔥',
      '{meal} just checked in 😋',
    ],
    MENU_UPDATE: [
      "Tomorrow's menu just dropped! 📋",
      'New menu alert! Check what\'s cooking tomorrow 👨‍🍳',
    ],
  },
}));

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default options', () => {
    const { result } = renderHook(() => useNotifications());
    
    expect(typeof result.current.showMealTimeNotification).toBe('function');
    expect(typeof result.current.showMenuUpdateNotification).toBe('function');
    expect(typeof result.current.showCustomNotification).toBe('function');
    expect(typeof result.current.showFavoriteNotification).toBe('function');
  });

  test('should show meal time notification', () => {
    const { result } = renderHook(() => useNotifications());
    
    const mockMeal = {
      name: 'Breakfast',
      start: { hour: 7, min: 30 },
      end: { hour: 9, min: 30 },
    };

    act(() => {
      result.current.showMealTimeNotification(mockMeal, '🌅');
    });

    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  test('should show menu update notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showMenuUpdateNotification();
    });

    expect(toast).toHaveBeenCalledTimes(1);
  });

  test('should show custom notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showCustomNotification('Test message', {
        type: 'success',
        emoji: '✅',
      });
    });

    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  test('should show favorite notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showFavoriteNotification('Dosa', true);
    });

    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  test('should not show notifications when disabled', () => {
    const { result } = renderHook(() => useNotifications({ enabled: false }));

    act(() => {
      result.current.showCustomNotification('Test message');
    });

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast).not.toHaveBeenCalled();
  });
});

describe('useMealTimeNotifications', () => {
  const mockMealNavigation = {
    dayOffset: 0,
    mealIndex: 0,
    isLive: true,
  };

  const mockCurrentTime = new Date('2023-12-08T07:30:00'); // 7:30 AM

  test('should not show notification when not live', () => {
    renderHook(() => 
      useMealTimeNotifications(
        { ...mockMealNavigation, isLive: false },
        mockCurrentTime,
        true
      )
    );

    expect(toast.success).not.toHaveBeenCalled();
  });

  test('should not show notification when disabled', () => {
    renderHook(() => 
      useMealTimeNotifications(
        mockMealNavigation,
        mockCurrentTime,
        false
      )
    );

    expect(toast.success).not.toHaveBeenCalled();
  });
});