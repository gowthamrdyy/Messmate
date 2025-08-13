import { render, screen } from '@testing-library/react';
import SwipeableContainer from '../SwipeableContainer';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock the swipe hook
jest.mock('../../hooks/useSwipeGestures', () => ({
  useMealSwipeNavigation: jest.fn(() => ({
    swipeHandlers: {
      onTouchStart: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchEnd: jest.fn(),
    },
    isSwipeActive: false,
    swipeDirection: null,
    swipeProgress: 0,
    feedbackVisible: false,
    feedbackDirection: null,
  })),
}));

// Mock SwipeIndicator
jest.mock('../SwipeIndicator', () => {
  return function MockSwipeIndicator({ isActive, direction }) {
    return isActive ? <div>Swipe Indicator: {direction}</div> : null;
  };
});

describe('SwipeableContainer', () => {
  const mockOnNext = jest.fn();
  const mockOnPrevious = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockOnPrevious.mockClear();
  });

  test('renders children correctly', () => {
    render(
      <SwipeableContainer onNext={mockOnNext} onPrevious={mockOnPrevious}>
        <div>Test Content</div>
      </SwipeableContainer>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <SwipeableContainer 
        onNext={mockOnNext} 
        onPrevious={mockOnPrevious}
        className="custom-swipe-container"
      >
        <div>Content</div>
      </SwipeableContainer>
    );

    expect(container.firstChild).toHaveClass('custom-swipe-container');
  });

  test('has proper touch action style', () => {
    const { container } = render(
      <SwipeableContainer onNext={mockOnNext} onPrevious={mockOnPrevious}>
        <div>Content</div>
      </SwipeableContainer>
    );

    expect(container.firstChild).toHaveStyle({ touchAction: 'pan-y' });
  });

  test('renders with disabled state', () => {
    render(
      <SwipeableContainer 
        onNext={mockOnNext} 
        onPrevious={mockOnPrevious}
        disabled={true}
      >
        <div>Content</div>
      </SwipeableContainer>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});