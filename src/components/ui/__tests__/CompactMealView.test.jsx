import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CompactMealView from '../CompactMealView';
import useAppStore from '../../../store/useAppStore';

// Mock the store
vi.mock('../../../store/useAppStore');

describe('CompactMealView', () => {
  const mockDate = new Date('2024-01-15'); // Monday
  const mockMenuItems = {
    breakfast: ['Bread,Butter,Jam', 'Idli', 'Sambar', 'Tea/Coffee/Milk'],
    lunch: ['Chappathi', 'Steamed Rice', 'Dal', 'Pickle'],
    snacks: ['Tea/Coffee'],
    dinner: ['Dosa', 'Chutney', 'Sambar', 'Steamed Rice']
  };

  const mockStore = {
    favorites: ['Idli', 'Dosa']
  };

  beforeEach(() => {
    useAppStore.mockReturnValue(mockStore);
  });

  it('renders compact meal view with all meals', () => {
    render(
      <CompactMealView 
        date={mockDate}
        menuItems={mockMenuItems}
      />
    );

    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Snacks')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
  });

  it('displays menu items for each meal', () => {
    render(
      <CompactMealView 
        date={mockDate}
        menuItems={mockMenuItems}
      />
    );

    expect(screen.getByText('Bread,Butter,Jam')).toBeInTheDocument();
    expect(screen.getByText('Idli')).toBeInTheDocument();
    expect(screen.getByText('Chappathi')).toBeInTheDocument();
    expect(screen.getByText('Dosa')).toBeInTheDocument();
  });

  it('shows favorite indicators for favorited items', () => {
    render(
      <CompactMealView 
        date={mockDate}
        menuItems={mockMenuItems}
      />
    );

    // Check for favorite star indicators
    const favoriteStars = screen.getAllByText('★');
    expect(favoriteStars.length).toBeGreaterThan(0);
  });



  it('displays meal timing information', () => {
    render(
      <CompactMealView 
        date={mockDate}
        menuItems={mockMenuItems}
      />
    );

    // Check for time information (should show meal times)
    expect(screen.getByText(/7:00/)).toBeInTheDocument();
    expect(screen.getByText(/11:30/)).toBeInTheDocument();
  });
});
