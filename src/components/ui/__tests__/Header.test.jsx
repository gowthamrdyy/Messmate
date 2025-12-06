import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock ThemeToggle
jest.mock('../ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button>Theme Toggle</button>;
  };
});

describe('Header Component', () => {
  const mockCurrentTime = new Date('2023-12-08T10:30:00');

  test('renders app name correctly', () => {
    render(<Header currentTime={mockCurrentTime} />);
    expect(screen.getByText('Messmate')).toBeInTheDocument();
  });

  test('renders app description', () => {
    render(<Header currentTime={mockCurrentTime} />);
    expect(screen.getByText('SRM Hostel Mess Menu')).toBeInTheDocument();
  });

  test('displays current time', () => {
    render(<Header currentTime={mockCurrentTime} />);
    // The time should be formatted and displayed
    const timeElement = screen.getByRole('time');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveClass('font-mono');
  });

  test('includes theme toggle', () => {
    render(<Header currentTime={mockCurrentTime} />);
    expect(screen.getByText('Theme Toggle')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <Header currentTime={mockCurrentTime} className="custom-header" />
    );
    expect(container.firstChild).toHaveClass('custom-header');
  });

  test('has proper sticky positioning', () => {
    const { container } = render(<Header currentTime={mockCurrentTime} />);
    expect(container.firstChild).toHaveClass('sticky', 'top-0', 'z-50');
  });
});