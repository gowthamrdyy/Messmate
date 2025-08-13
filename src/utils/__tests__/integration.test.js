/**
 * Integration tests for the complete Messmate application
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../hooks/useTheme';
import App from '../../App';

// Mock external dependencies
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

jest.mock('../../services/notificationService', () => ({
  requestPermission: jest.fn().mockResolvedValue(true),
}));

// Mock PWA and offline functionality
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(),
  },
});

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

const renderApp = () => {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

describe('Messmate Application Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock current time to a consistent value
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Application Initialization', () => {
    test('should render the complete application with all components', async () => {
      renderApp();

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Check for main components
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // Bottom navigation
    });

    test('should handle app initialization and loading states', async () => {
      renderApp();

      // Should show loading state initially
      expect(screen.getByText(/Preparing your delicious menu/)).toBeInTheDocument();

      // Wait for app to be ready
      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Should show current time
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('should initialize with default settings', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Should default to Sannasi mess
      expect(screen.getByText('Sannasi')).toBeInTheDocument();
      
      // Should show current meal
      expect(screen.getByText(/Lunch|Breakfast|Dinner|Snacks/)).toBeInTheDocument();
    });
  });

  describe('Navigation and Section Switching', () => {
    test('should switch between different sections', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Navigate to Calendar section
      const calendarButton = screen.getByRole('button', { name: /calendar/i });
      await user.click(calendarButton);

      // Should show calendar content
      await waitFor(() => {
        expect(screen.getByText(/Loading calendar/)).toBeInTheDocument();
      });

      // Navigate to Favorites section
      const favoritesButton = screen.getByRole('button', { name: /favorites/i });
      await user.click(favoritesButton);

      // Should show favorites content
      await waitFor(() => {
        expect(screen.getByText(/Loading favorites/)).toBeInTheDocument();
      });

      // Navigate to Settings section
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await user.click(settingsButton);

      // Should show settings content
      await waitFor(() => {
        expect(screen.getByText(/Loading settings/)).toBeInTheDocument();
      });

      // Navigate back to Home
      const homeButton = screen.getByRole('button', { name: /home/i });
      await user.click(homeButton);

      // Should show home content
      await waitFor(() => {
        expect(screen.getByText(/Lunch|Breakfast|Dinner|Snacks/)).toBeInTheDocument();
      });
    });
  });

  describe('Meal Navigation', () => {
    test('should navigate between meals', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Get current meal
      const currentMeal = screen.getByText(/Lunch|Breakfast|Dinner|Snacks/);
      const currentMealText = currentMeal.textContent;

      // Navigate to next meal
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should show different meal
      await waitFor(() => {
        const newMeal = screen.getByText(/Lunch|Breakfast|Dinner|Snacks/);
        expect(newMeal.textContent).not.toBe(currentMealText);
      });

      // Navigate to previous meal
      const previousButton = screen.getByRole('button', { name: /previous/i });
      await user.click(previousButton);

      // Should return to original meal
      await waitFor(() => {
        const originalMeal = screen.getByText(/Lunch|Breakfast|Dinner|Snacks/);
        expect(originalMeal.textContent).toBe(currentMealText);
      });
    });

    test('should handle go live functionality', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Navigate away from current meal
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Go live should be available
      const goLiveButton = screen.getByRole('button', { name: /go live/i });
      await user.click(goLiveButton);

      // Should return to current meal
      await waitFor(() => {
        expect(screen.getByText(/Lunch|Breakfast|Dinner|Snacks/)).toBeInTheDocument();
      });
    });
  });

  describe('Mess Selection', () => {
    test('should switch between different messes', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Should start with Sannasi
      expect(screen.getByText('Sannasi')).toBeInTheDocument();

      // Switch to M-Block
      const mblockButton = screen.getByRole('button', { name: /m-block/i });
      await user.click(mblockButton);

      // Should show M-Block
      await waitFor(() => {
        expect(screen.getByText('M-Block')).toBeInTheDocument();
      });

      // Switch back to Sannasi
      const sannasiButton = screen.getByRole('button', { name: /sannasi/i });
      await user.click(sannasiButton);

      // Should show Sannasi
      await waitFor(() => {
        expect(screen.getByText('Sannasi')).toBeInTheDocument();
      });
    });
  });

  describe('Compact Mode', () => {
    test('should toggle compact mode', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Should start in normal mode
      expect(screen.getByRole('button', { name: /compact/i })).toBeInTheDocument();

      // Toggle to compact mode
      const compactButton = screen.getByRole('button', { name: /compact/i });
      await user.click(compactButton);

      // Should show normal mode button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /normal/i })).toBeInTheDocument();
      });

      // Toggle back to normal mode
      const normalButton = screen.getByRole('button', { name: /normal/i });
      await user.click(normalButton);

      // Should show compact mode button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /compact/i })).toBeInTheDocument();
      });
    });
  });

  describe('Favorites Functionality', () => {
    test('should add and remove favorites', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Find a menu item to favorite
      const menuItems = screen.getAllByRole('button', { name: /add.*to favorites/i });
      
      if (menuItems.length > 0) {
        const firstItem = menuItems[0];
        await user.click(firstItem);

        // Should show remove from favorites button
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /remove.*from favorites/i })).toBeInTheDocument();
        });

        // Remove from favorites
        const removeButton = screen.getByRole('button', { name: /remove.*from favorites/i });
        await user.click(removeButton);

        // Should show add to favorites button
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /add.*to favorites/i })).toBeInTheDocument();
        });
      }
    });
  });

  describe('Theme Toggle', () => {
    test('should toggle between light and dark themes', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Find theme toggle button
      const themeButton = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(themeButton);

      // Should apply dark theme classes
      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark');
      });

      // Toggle back to light theme
      await user.click(themeButton);

      // Should remove dark theme classes
      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass('dark');
      });
    });
  });

  describe('Accessibility Features', () => {
    test('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Tab through interactive elements
      await user.tab();
      
      // Should focus on first interactive element
      expect(document.activeElement).toHaveClass('focus-visible');

      // Continue tabbing
      await user.tab();
      await user.tab();
      
      // Should maintain focus
      expect(document.activeElement).toBeInTheDocument();
    });

    test('should have proper ARIA labels', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Check for proper ARIA labels
      expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Application header');
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Meal navigation');
    });

    test('should have skip links', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Check for skip links
      const skipLinks = screen.getAllByRole('link', { name: /skip to/i });
      expect(skipLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle component errors gracefully', async () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // The app should still render even if some components fail
      expect(screen.getByText('Messmate')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    test('should render within acceptable time', async () => {
      const startTime = performance.now();
      
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 3 seconds
      expect(renderTime).toBeLessThan(3000);
    });

    test('should handle rapid interactions', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Rapidly click navigation buttons
      const nextButton = screen.getByRole('button', { name: /next/i });
      const previousButton = screen.getByRole('button', { name: /previous/i });

      await user.click(nextButton);
      await user.click(previousButton);
      await user.click(nextButton);
      await user.click(previousButton);

      // App should remain stable
      expect(screen.getByText('Messmate')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('should adapt to different screen sizes', async () => {
      // Test mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Should show mobile navigation
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Test desktop view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      // App should remain functional
      expect(screen.getByText('Messmate')).toBeInTheDocument();
    });
  });

  describe('Data Persistence', () => {
    test('should persist user preferences', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Change theme
      const themeButton = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(themeButton);

      // Change mess
      const mblockButton = screen.getByRole('button', { name: /m-block/i });
      await user.click(mblockButton);

      // Toggle compact mode
      const compactButton = screen.getByRole('button', { name: /compact/i });
      await user.click(compactButton);

      // Check localStorage
      expect(localStorage.getItem('messmate-preferences')).toBeTruthy();

      // Reload app
      window.location.reload();

      // Preferences should be restored
      await waitFor(() => {
        expect(screen.getByText('Messmate')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Should show M-Block (persisted selection)
      expect(screen.getByText('M-Block')).toBeInTheDocument();
    });
  });
});
