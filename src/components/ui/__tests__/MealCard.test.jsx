import { render, screen, fireEvent } from '@testing-library/react';
import MealCard from '../MealCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: () => <span>Heart Icon</span>,
  Star: () => <span>Star Icon</span>,
}));

// Mock the store
const mockStore = {
  favorites: ['Dosa'],
  toggleFavorite: jest.fn(),
  ratings: { 'Dosa': 4 },
  setRating: jest.fn(),
};

jest.mock('../../store/useAppStore', () => ({
  __esModule: true,
  default: () => mockStore,
}));

describe('MealCard Component', () => {
  const mockMeal = {
    name: 'Breakfast',
    start: { hour: 7, min: 30 },
    end: { hour: 9, min: 30 },
  };

  const mockMenuItems = ['Dosa', 'Idli', 'Sambar', 'Chutney'];

  test('renders meal information correctly', () => {
    render(
      <MealCard 
        meal={mockMeal}
        menuItems={mockMenuItems}
        dayLabel="Today"
      />
    );
    
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText(/7:30 AM – 9:30 AM/)).toBeInTheDocument();
  });

  test('renders menu items with emojis', () => {
    render(
      <MealCard 
        meal={mockMeal}
        menuItems={mockMenuItems}
      />
    );
    
    mockMenuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test('shows empty state when no menu items', () => {
    render(
      <MealCard 
        meal={mockMeal}
        menuItems={[]}
      />
    );
    
    expect(screen.getByText('No menu items available')).toBeInTheDocument();
    expect(screen.getByText('Check back later for updates')).toBeInTheDocument();
  });

  test('renders favorite buttons for each item', () => {
    render(
      <MealCard 
        meal={mockMeal}
        menuItems={mockMenuItems}
      />
    );
    
    const heartIcons = screen.getAllByText('Heart Icon');
    expect(heartIcons).toHaveLength(mockMenuItems.length);
  });

  test('shows ratings for rated items', () => {
    render(
      <MealCard 
        meal={mockMeal}
        menuItems={mockMenuItems}
      />
    );
    
    // Should show star icons for the rated item (Dosa has 4 stars)
    const starIcons = screen.getAllByText('Star Icon');
    expect(starIcons.length).toBeGreaterThan(0);
  });

  test('applies horizontal scroll class when enabled', () => {
    const { container } = render(
      <MealCard 
        meal={mockMeal}
        menuItems={mockMenuItems}
        showHorizontalScroll={true}
      />
    );
    
    const scrollContainer = container.querySelector('.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('snap-x', 'snap-mandatory');
  });

  test('applies vertical scroll class when horizontal scroll disabled', () => {
    const { container } = render(
      <MealCard 
        meal={mockMeal}
        menuItems={mockMenuItems}
        showHorizontalScroll={false}
      />
    );
    
    const scrollContainer = container.querySelector('.overflow-y-auto');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('grid', 'grid-cols-1');
  });

  test('handles favorite toggle click', () => {
    const mockToggleFavorite = jest.fn();
    
    // Re-mock the store for this test
    jest.doMock('../../store/useAppStore', () => ({
      __esModule: true,
      default: () => ({
        favorites: [],
        toggleFavorite: mockToggleFavorite,
        ratings: {},
        setRating: jest.fn(),
      }),
    }));

    render(
      <MealCard 
        meal={mockMeal}
        menuItems={['Dosa']}
      />
    );
    
    const favoriteButton = screen.getByText('Heart Icon').closest('button');
    fireEvent.click(favoriteButton);
    
    expect(mockToggleFavorite).toHaveBeenCalledWith('Dosa');
  });

  test('applies custom className', () => {
    const { container } = render(
      <MealCard 
        meal={mockMeal}
        menuItems={mockMenuItems}
        className="custom-meal-card"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-meal-card');
  });

  test('sorts favorite items to the top', () => {
    // Mock store with Sambar as favorite
    mockStore.favorites = ['Sambar'];
    
    render(
      <MealCard 
        meal={mockMeal}
        menuItems={['Dosa', 'Idli', 'Sambar', 'Chutney']}
      />
    );
    
    const menuItemElements = screen.getAllByText(/^(Dosa|Idli|Sambar|Chutney)$/);
    
    // Sambar should be first since it's a favorite
    expect(menuItemElements[0]).toHaveTextContent('Sambar');
  });

  test('shows favorite badge for favorite items', () => {
    mockStore.favorites = ['Dosa'];
    
    render(
      <MealCard 
        meal={mockMeal}
        menuItems={['Dosa', 'Idli']}
      />
    );
    
    // Should show star badge for favorite item
    expect(screen.getByText('★')).toBeInTheDocument();
  });
});