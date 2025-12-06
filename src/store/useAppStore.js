import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { THEMES, STORAGE_KEYS } from '../utils/constants';
import { hasSimilarFavorite, getMatchingFavorite } from '../utils/itemMatching';

// Helper function to get current or next meal
const getCurrentOrNextMeal = (now = new Date(), navDayOffset = 0) => {
  const weekdaySchedule = [
    { name: 'Breakfast', start: { hour: 7, min: 0 }, end: { hour: 9, min: 30 } },
    { name: 'Lunch', start: { hour: 11, min: 30 }, end: { hour: 13, min: 30 } },
    { name: 'Snacks', start: { hour: 16, min: 30 }, end: { hour: 17, min: 30 } },
    { name: 'Dinner', start: { hour: 19, min: 30 }, end: { hour: 21, min: 0 } },
  ];

  const weekendSchedule = [
    { name: 'Breakfast', start: { hour: 7, min: 30 }, end: { hour: 9, min: 30 } },
    { name: 'Lunch', start: { hour: 12, min: 0 }, end: { hour: 14, min: 0 } },
    { name: 'Snacks', start: { hour: 16, min: 30 }, end: { hour: 17, min: 30 } },
    { name: 'Dinner', start: { hour: 19, min: 30 }, end: { hour: 21, min: 0 } },
  ];

  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + navDayOffset);
  const day = date.getDay();
  const schedule = (day === 0 || day === 6) ? weekendSchedule : weekdaySchedule;
  const minutes = now.getHours() * 60 + now.getMinutes();

  // For today (navDayOffset === 0), always show today's meals
  if (navDayOffset === 0) {
    // Check if we're in any meal time
    for (let i = 0; i < schedule.length; i++) {
      const start = schedule[i].start.hour * 60 + schedule[i].start.min;
      const end = schedule[i].end.hour * 60 + schedule[i].end.min;
      if (minutes >= start && minutes < end) {
        return { mealIndex: i, dayOffset: 0 };
      }
    }

    // If we're not in any meal time, find the next meal
    for (let i = 0; i < schedule.length; i++) {
      const start = schedule[i].start.hour * 60 + schedule[i].start.min;
      if (minutes < start) {
        return { mealIndex: i, dayOffset: 0 };
      }
    }

    // If we're past all meals today, show the first meal of today
    return { mealIndex: 0, dayOffset: 0 };
  }

  // For other day offsets, return the first meal of that day
  return { mealIndex: 0, dayOffset: navDayOffset };
};

// Create the main app store
const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme state
      theme: THEMES.DARK,
      systemPreference: THEMES.DARK,

      // Navigation state
      selectedMess: 'sannasi',
      currentTime: new Date(),
      mealNavigation: {
        dayOffset: 0,
        mealIndex: 0,
        isLive: true,
      },

      // UI state
      compactMode: false,
      showWeeklyView: false,
      isLoading: false,

      // User preferences
      favorites: [],
      ratings: {},
      notificationLanguage: 'english',

      // PWA state
      installPrompt: null,
      isInstalled: false,

      // Actions
      setTheme: (theme) => {
        if (Object.values(THEMES).includes(theme)) {
          set({ theme });

          // Apply theme to document
          const root = document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(theme);
          root.setAttribute('data-theme', theme);
        }
      },

      setNotificationLanguage: (language) => {
        set({ notificationLanguage: language });
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        get().setTheme(newTheme);
      },

      setSystemPreference: (preference) => {
        set({ systemPreference: preference });
      },

      setSelectedMess: (mess) => {
        set({ selectedMess: mess });
      },

      updateCurrentTime: (time) => {
        const state = get();
        set({ currentTime: time });

        // Auto-update meal navigation if in live mode
        if (state.mealNavigation.isLive) {
          const current = getCurrentOrNextMeal(time, 0);
          if (
            state.mealNavigation.dayOffset !== current.dayOffset ||
            state.mealNavigation.mealIndex !== current.mealIndex
          ) {
            set({
              mealNavigation: {
                dayOffset: current.dayOffset,
                mealIndex: current.mealIndex,
                isLive: true,
              },
            });
          }
        }
      },



      navigateToPreviousMeal: () => {
        const { currentTime, mealNavigation } = get();
        const date = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate() + mealNavigation.dayOffset
        );
        const day = date.getDay();
        const scheduleLength = (day === 0 || day === 6) ? 4 : 4; // Both have 4 meals

        if (mealNavigation.mealIndex === 0) {
          set({
            mealNavigation: {
              dayOffset: mealNavigation.dayOffset - 1,
              mealIndex: scheduleLength - 1,
              isLive: false,
            },
          });
        } else {
          set({
            mealNavigation: {
              ...mealNavigation,
              mealIndex: mealNavigation.mealIndex - 1,
              isLive: false,
            },
          });
        }
      },

      navigateToNextMeal: () => {
        const { currentTime, mealNavigation } = get();
        const date = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate() + mealNavigation.dayOffset
        );
        const day = date.getDay();
        const scheduleLength = (day === 0 || day === 6) ? 4 : 4; // Both have 4 meals

        if (mealNavigation.mealIndex === scheduleLength - 1) {
          set({
            mealNavigation: {
              dayOffset: mealNavigation.dayOffset + 1,
              mealIndex: 0,
              isLive: false,
            },
          });
        } else {
          set({
            mealNavigation: {
              ...mealNavigation,
              mealIndex: mealNavigation.mealIndex + 1,
              isLive: false,
            },
          });
        }
      },

      goLive: () => {
        const { currentTime } = get();
        const current = getCurrentOrNextMeal(currentTime, 0);
        set({
          mealNavigation: {
            dayOffset: current.dayOffset,
            mealIndex: current.mealIndex,
            isLive: true,
          },
        });
      },

      setMealNavigation: (dayOffset, mealIndex = 0, isLive = false) => {
        set({
          mealNavigation: {
            dayOffset,
            mealIndex,
            isLive,
          },
        });
      },

      setCompactMode: (enabled) => {
        set({ compactMode: enabled });
      },

      toggleCompactMode: () => {
        const { compactMode } = get();
        set({ compactMode: !compactMode });
      },

      setShowWeeklyView: (show) => {
        set({ showWeeklyView: show });
      },

      toggleWeeklyView: () => {
        const { showWeeklyView } = get();
        set({ showWeeklyView: !showWeeklyView });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      addToFavorites: (item) => {
        const { favorites } = get();
        // Check if item or similar item already exists
        const existingFavorite = getMatchingFavorite(item, favorites);

        if (!existingFavorite && !favorites.includes(item)) {
          set({ favorites: [...favorites, item] });
        }
      },

      removeFromFavorites: (item) => {
        const { favorites } = get();
        // Remove exact match or similar items
        const updatedFavorites = favorites.filter(fav =>
          fav !== item && !hasSimilarFavorite(fav, [item])
        );
        set({ favorites: updatedFavorites });
      },

      toggleFavorite: (item) => {
        const { favorites } = get();
        const existingFavorite = getMatchingFavorite(item, favorites);

        if (favorites.includes(item) || existingFavorite) {
          // Remove the existing favorite (exact or similar)
          get().removeFromFavorites(existingFavorite || item);
        } else {
          get().addToFavorites(item);
        }
      },

      setRating: (item, rating) => {
        const { ratings } = get();
        set({ ratings: { ...ratings, [item]: rating } });
      },



      setInstallPrompt: (prompt) => {
        set({ installPrompt: prompt });
      },

      setIsInstalled: (installed) => {
        set({ isInstalled: installed });
      },

      // PWA Installation methods
      installPWA: () => {
        const { installPrompt } = get();
        if (installPrompt) {
          installPrompt.prompt();
          installPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
              set({ isInstalled: true, installPrompt: null });
            } else {
              console.log('User dismissed the install prompt');
              set({ installPrompt: null });
            }
          });
        }
      },

      // Initialize store
      initialize: () => {
        const now = new Date();
        // Always start with today (dayOffset: 0) and find the appropriate meal
        const current = getCurrentOrNextMeal(now, 0);

        set({
          currentTime: now,
          mealNavigation: {
            dayOffset: 0, // Always start with today
            mealIndex: current.mealIndex,
            isLive: true,
          },
        });

        // Detect system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const systemPref = mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
        get().setSystemPreference(systemPref);

        // Use saved theme or default to dark theme
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
          get().setTheme(savedTheme);
        } else {
          // Default to dark theme instead of system preference
          get().setTheme(THEMES.DARK);
        }

        // Listen for system preference changes
        const handleChange = (e) => {
          const newPref = e.matches ? THEMES.DARK : THEMES.LIGHT;
          get().setSystemPreference(newPref);
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
      },
    }),
    {
      name: STORAGE_KEYS.PREFERENCES,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        selectedMess: state.selectedMess,
        compactMode: state.compactMode,
        favorites: state.favorites,
        ratings: state.ratings,
        notificationLanguage: state.notificationLanguage,
      }),
    }
  )
);

export default useAppStore;