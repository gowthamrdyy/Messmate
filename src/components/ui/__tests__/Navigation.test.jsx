import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navigation from '../Navigation';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span>ChevronLeft</span>,
  ChevronRight: () => <span>ChevronRight</span>,
  Radio: () => <span>Radio</span>,
  Clock: () => <span>Clock</span>,
}));

// Mock Glass component
jest.mock('../Glass', () => {
  return function MockGlass({ children, ...props }) {
    return <div {...props}>{children}</div>;
  };
});

describe('Navigation Component', () => {
  const mockMeal = {
    name: 'Breakfast',
    start: { hour: 7, min: 30 },
    end: { hour: 9, min: 30 },
  };

  const mockProps = {
    meal: mockMeal,
    dayLabel: 'Today',
    isLive: true,
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onGoLive: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders meal information correctly', () => {
    render(<Navigation {...mockProps} />);
    
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  test('shows live indicator when isLive is true', () => {
    render(<Navigation {...mockProps} isLive={true} />);
    
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('Radio')).toBeInTheDocument();
  });

  test('shows go live button when isLive is false', () => {
    render(<Navigation {...mockProps} isLive={false} />);
    
    expect(screen.getByText('Go Live')).toBeInTheDocument();
    expect(screen.getByText('Clock')).toBeInTheDocument();
  });

  test('calls onPrevious when previous button is clicked', async () => {
    render(<Navigation {...mockProps} />);
    
    const prevButton = screen.getByText('Prev').closest('button');
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(mockProps.onPrevious).toHaveBeenCalledTimes(1);
    });
  });

  test('calls onNext when next button is clicked', async () => {
    render(<Navigation {...mockProps} />);
    
    const nextButton = screen.getByText('Next').closest('button');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockProps.onNext).toHaveBeenCalledTimes(1);
    });
  });

  test('calls onGoLive when go live button is clicked', () => {
    render(<Navigation {...mockProps} isLive={false} />);
    
    const goLiveButton = screen.getByText('Go Live').closest('button');
    fireEvent.click(goLiveButton);
    
    expect(mockProps.onGoLive).toHaveBeenCalledTimes(1);
  });

  test('disables buttons when disabled prop is true', () => {
    render(<Navigation {...mockProps} disabled={true} />);
    
    const prevButton = screen.getByText('Prev').closest('button');
    const nextButton = screen.getByText('Next').closest('button');
    
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test('does not call navigation functions when disabled', () => {
    render(<Navigation {...mockProps} disabled={true} />);
    
    const prevButton = screen.getByText('Prev').closest('button');
    const nextButton = screen.getByText('Next').closest('button');
    
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);
    
    expect(mockProps.onPrevious).not.toHaveBeenCalled();
    expect(mockProps.onNext).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    const { container } = render(
      <Navigation {...mockProps} className="custom-navigation" />
    );
    
    expect(container.firstChild).toHaveClass('custom-navigation');
  });

  test('has proper accessibility attributes', () => {
    render(<Navigation {...mockProps} />);
    
    const prevButton = screen.getByLabelText('Previous meal');
    const nextButton = screen.getByLabelText('Next meal');
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  test('shows gradient styling on navigation buttons', () => {
    render(<Navigation {...mockProps} />);
    
    const prevButton = screen.getByText('Prev').closest('button');
    const nextButton = screen.getByText('Next').closest('button');
    
    expect(prevButton).toHaveClass('bg-gradient-to-r');
    expect(nextButton).toHaveClass('bg-gradient-to-r');
  });
});