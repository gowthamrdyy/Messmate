import { useEffect, useState, lazy, Suspense } from 'react';
import './App.css';
import { Instagram, Github, Linkedin } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import Header from './components/ui/Header';
import BlockSelector from './components/ui/BlockSelector';
import CompactModeToggle from './components/ui/CompactModeToggle';
import Navigation from './components/ui/Navigation';
import MealCard from './components/ui/MealCard';
import SwipeableContainer from './components/ui/SwipeableContainer';
import CompactMealView from './components/ui/CompactMealView';
import DaySelector from './components/ui/DaySelector';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';
import OfflineIndicator from './components/ui/OfflineIndicator';
import NotificationSystem from './components/notifications/NotificationSystem';
import { PageLoadingState, AppLoadingState } from './components/ui/LoadingState';
import PageTransition, { FadeIn, SlideUp, StaggerContainer, StaggerItem } from './components/ui/PageTransition';
import ErrorBoundary from './components/ui/ErrorBoundary';
import BottomNavigation from './components/ui/BottomNavigation';
import PerformanceMonitor from './components/ui/PerformanceMonitor';
import SkipLinks from './components/ui/SkipLinks';
import { useBottomNavigation, useSectionVisibility } from './hooks/useBottomNavigation';
import useOfflineData from './hooks/useOfflineData';
import notificationService from './services/notificationService';
import { useTheme } from './hooks/useTheme.jsx';
import useAppStore from './store/useAppStore';

import { getScheduleForDay } from './utils/mealSchedule';
import { formatCurrentTime, getDayLabel, getDayKey } from './utils/dateHelpers';
import { useIsMobile } from './hooks/useMediaQuery';
import { useMealTimeNotifications, useMenuUpdateNotifications } from './hooks/useNotifications.jsx';

// Lazy load heavy sections for code splitting
const FavoritesSection = lazy(() => import('./components/sections/FavoritesSection'));
const CalendarSection = lazy(() => import('./components/sections/CalendarSection'));
const SettingsSection = lazy(() => import('./components/sections/SettingsSection'));

// Manual HTML icons as fallbacks
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block' }}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block' }}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block' }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Sample menu data for both messes and all days - Standardized to match Wednesday's size
const menuData = {
  sannasi: {
    monday:    { breakfast: ["Sweet", "Bread,Butter,Jam", "Idly", "Sambar", "Spl Chutney", "Poori", "Aloo Dal Masala", "Tea/Coffee/Milk", "Boiled Egg", "Banana"], lunch: ["Chappathi", "Chapp kasa", "Jeera Pulao", "Steamed Rice", "Masala Sambhar", "Bagara Dal", "Mix veg Usili", "Lemon rasam", "Pickle","Butter Milk","Fryums"], snacks: ["Pav Bajji", "Tea/Coffee"], dinner: ["Punjabi paratha", "Rajma Makkan wala", "Dosa","Idli podi","Oil","Special Chutney","Steamed rice","Vegetable dal","Rasam","Pickle","Fryums","Veg-Salad","**Mutton Gravy**"] },
    tuesday:   { breakfast: ["Bread,Butter,Jam","Ghee Pongal", "Vada", "Veg kosthu","Coconut chutney","Poha","Mint chutney","Masala Omlet", "Tea/Coffee/Milk", "Banana"], lunch: ["Sweet","Poori","Mattar Ghughni","Variety rice","Steamed rice","Sambhar","Dal Lasooni","Tomato","Rasam","Gobi-65/Bhinidi Jaipuri","Fryums","Butter milk","Pickle"], snacks: ["Boiled Peanut/Black channa sundal", "Tea/Coffee"], dinner: ["Chappathi", "Mixveg kurma", "Friedrice/Noodles","Manchurian Dry/Crispy Veg","Steamed Rice","Rasam", "Dal fry","Pickle", "Fryums", "Veg Salad", "Milk","spl fruits","**Chicken Gravy**"] },
    wednesday: { breakfast: ["Bread,Butter,Jam","Dosa", "Idly Podi", "Oil", "Arichuvita Sambhar","Chutney", "Chappathi","Aloo Rajma Masala", "Tea/Coffee/Milk","Banana"], lunch: ["Butter Roti", "Aloo Palak", "Peas Pulao", "Dal Makhni", "Kadai Veggies", "Steamed Rice", "Drumstick Brinjal", "Sambhar", "Garlic Rasam", "Butter milk", "Fryums"], snacks: ["Veg Puff/Sweet Puff", "Coffee/Tea"], dinner: ["Chappathi", "Steamed rice","Chicken Masala/Paneer Butter Masala", "Rasam","Pickle","Fryums","Veg Salad","**Chicken gravy**"] },
    thursday:  { breakfast: ["Bread,Butter,Jam","Chappathi", "Aloo Meal Maker Kasa", "Veg semiya Kichidi", "Coconut Chutney", "Boiled Egg", "Tea/Coffee/Milk", "Banana"], lunch: ["Luchi", "Kashmiri Dum Aloo", "Onion Pulao", "Steamed Rice", "Mysore Dal Fry","Kadai Pakoda", "Pepper Rasam", "Poriyal", "Pickle", "Fryums", "Butter Milk"], snacks: ["Pani Puri/Chunda Nasta", "Coffee/Tea"], dinner: ["Ghee Pulao/Kaju Pulao(Basmati Rice)", "Chappathi", "Muttar Panner", "Steamed Rice", "Tadka Dal", "Rasam", "Aloo Peanut Masala", "Fryums","Milk", "Pickle","veg Salad","**Mutton Gravy**"] },
    friday:    { breakfast: ["Bread,Butter,Jam","Podi Dosa", "Idly Podi", "Oil", "Chilli Sambar", "Chutney", "Chappathi", "Muttar Masala", "Tea/Coffee/Milk", "Boiled Egg", "Banana"], lunch: ["Dry Jamun/Bread Halwa", "Veg Biryani", "Mix Raitha", "Bisbelabath", "Curd Rice", "Steamed Rice", "Tomato Rasam", "Aloo Gobi Adarki","Moongdal Tadka", "Pickle", "Fryums"], snacks: ["Bonda/Vada", "Chutney","Coffee/Tea"], dinner: ["Chole Bhatura","Steamed Rice","Tomato dal","Sambha Rava Upma","Coconut Chutney","Rasam","Cabbage Poriyal","Pickle","Fryums","Veg salad","Milk","**Chicken Gravy**"] },
    saturday:  { breakfast: ["Bread,Butter,Jam","Chappathi", "Veg Khurma", "Idiyappam(Lemon/Masala)","Coconut Chutney", "Tea/Coffee/Milk", "Boiled Egg", "Banana"], lunch: ["Poori", "Dal Aloo Masala", "Veg Pulao", "Steamed Rice", "Punjabi Dal Tadka","Bhindi Do Pyasa", "Kara Kuzhambu", "Kootu", "Jeera Rasam", "Pickle", "Special Fryums","Butter Milk"], snacks: ["Cake/Brownie", "Coffee/Tea"], dinner: ["Sweet", "Malabar Paratha", "Meal maker Curry", "Mix Vegetable Sabji", "Steamed Rice","Dal Makhini","Rasam", "Idli","Idli Podi","Sambhar", "Oil", "Fryums", "Pickle", "Veg Salad","**Fish Gravy**"] },
    sunday:    { breakfast: ["Bread,Butter,Jam", "Chole Puri", "Veg Upma", "Coconut Chutney","Tea/Coffee/Milk", "Banana"], lunch: [ "Chappathi", "Chicken (Pepper/Kadai)","Panner Butter Masala/Kadai Panner", "Dal Dhadka", "Mint Pulao", "Steamed Rice", "Garlic Rasam", "Poriyal", "Pickle","Butter Milk", "Fryums","**Chicken Gravy**"], snacks: ["Corn/Bajji","Chutney", "Coffee/Tea"], dinner: ["Variety Stuffing Paratha","Curd", "Steamed Rice", "Hara Moong Dal Tadka", "Kathamba Sambhar", "Poriyal", "Rasam", "Pickle", "Fryums","Veg Salad", "Milk","Ice cream","**Chicken Gravy**"] },
  },
  mblock: {
    monday:    { breakfast: ["Bread,Butter,Jam", "Pongal", "Sambar", "Coconut Chutney","Vada", "Chappathi", "Soya Aloo Kasha", "Tea/Coffee/Milk", "Banana"], lunch: ["Mint Chappathi", "Black Channa Masala", "Mutter Pulao", "Dal Makhni", "Steamed Rice", "Arachivitta Sambar", "Keerai Kootu", "Rasam","Buttermilk", "Fryums", "Pickle"], snacks: ["Samosa/Veg Spring Roll", "Tea/Lemon Juice/Milk", "Bread/Butter/Jam","Pepper kashayam"], dinner: ["Chappathi", "Tomato Dal", "Idli", "Chutney", "Sambar", "Idli Podi","Oil", "Steamed Rice", "Rasam", "Buttermilk", "Pickle", "Salad", "Milk", "**Fish Gravy**"] },
    tuesday:   { breakfast: ["Bread,Butter,Jam", "Poori", "Aloo Masala","Veg Rava Kitchadi", "Sambar", "Chutney", "Tea/Coffee/Milk", "Banana"], lunch: ["Payasam", "Chappathi", "White Peas Curry", "Jeera Pulao", "Dal Fry","Steamed Rice", "Kara Kuzhambu", "Rasam", "Cabbage Kootu","Buttermilk", "Fryums", "Pickle"], snacks: ["Pani Pori/Pav Bhaji", "Tea/Coffee/Milk", "Bread/Butter/Jam","Coriander kashayam"], dinner: ["Millet Chappathi", "Black Channa Masala", "Dosa", "Sambar", "Chutney", "Idli Podi", "Oil", "Steamed Rice", "Rasam", "Buttermilk", "Salad", "Pickle","Milk", "**Mutton Kulambu**"] },
    wednesday: { breakfast: ["Bread,Butter,Jam","Idiyappam", "Vada Curry/Veg Stew","Mint Chutney", "Poha", "Tea/Coffee/Milk", "Banana"], lunch: ["Chappathi", "Rajma Masala", "Variety Rice", "Curd Rice", "Urulai Kara Masala", "Steamed Rice", "Rasam", "Appalam", "Pickle"], snacks: ["Bakery Snacks", "Tea/Coffee/Milk", "Bread/Butter/Jam","Ginger kashayam"], dinner: ["Chappathi", "Paneer Butter Masala", "Steamed Rice", "Sambar", "Jeera Rasam","Buttermilk", "Pickle", "Milk", "**Chicken Gravy/Chicken Biryani**"] },
    thursday:  { breakfast: ["Bread,Butter,Jam","Idli", "Groundnut Chutney", "Sambar",  "Chappathi", "White Peas Masala", "Tea/Coffee/Milk", "Banana"], lunch: ["Sweet Pongal/Boondhi", "Beetroot Chappathi", "Gobi Capsicum", "Dal Fry","Veg Pulao", "Steamed Rice", "Karakulambu", "Keerai Kootu", "Rasam","Buttermilk", "Fryums", "Pickle"], snacks: ["Navadhaniya Sundal", "Tea/Coffee/Milk", "Bread/Butter/Jam","Jeera kashayam"], dinner: ["Chole Poori", "Channa Masala", "Dosa", "Sambar", "Chutney", "Steamed Rice", "Rasam", "Buttermilk", "Onion Salad", "Pickle", "Milk","**Cup Ice Cream**", "**Chicken Gravy**"] },
    friday:    { breakfast: ["Bread,Butter,Jam","Chappathi", "Channa Dal", "Kal Dosa", "Sambar", "Chutney", "Omelette", "Tea/Coffee/Milk", "Banana", "Idli Podi", "Oil"], lunch: ["Chappathi", "Dal Tadka", "Peas Pulao", "Spinach Aloo", "Steamed Rice","Sambar", "Mix Veg Poriyal", "Rasam", "Buttermilk", "Fryums", "Pickle"], snacks: ["Bajji/Mysore Bonda", "Chutney", "Tea/Rose Milk", "Bread/Butter/Jam","Sukkiu kashayam"], dinner: ["Veg Soup", "Chappathi", "Veg Manchurian Gravy", "Fried Rice/Noodles", "Dal Fry", "Steamed Rice", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Chicken Gravy**"] },
    saturday:  { breakfast: ["Bread,Butter,Jam", "Aloo Paratha", "Curd", "Idli", "Sambar","Groundnut Chutney", "Tea/Coffee/Milk", "Banana", "Boiled Egg"], lunch: ["Gulab Jamun/Millet Payasam", "Chappathi", "Meal Maker Curry","Veg Biryani", "Raitha", "Curd Rice", "Steamed Rice", "Rasam","Keerai Kootu", "Fryums", "Pickle"], snacks: ["Cake Variety", "Tea/Coffee/Milk", "Bread/Butter/Jam","Nilavembu kashayam"], dinner: ["Paratha", "Veg Salna", "Dosa", "Chutney", "Tiffin Sambar", "Idli Podi", "Oil", "Steamed Rice", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Mutton Gravy**"] },
    sunday:    { breakfast: ["Bread,Butter,Jam","Chole Bhature", "Chenna Masala", "Rava Upma","Coconut Chutney", "Sambar", "Tea/Coffee/Milk", "Seasonal Fruit"], lunch: ["Chappathi", "Chicken Gravy", "Paneer Mutter Kasa", "Sambar", "Steamed Rice","Dal Fry", "Rasam", "Poriyal", "Buttermilk", "Milk", "Pickle", "Fryums"], snacks: ["Peanut Sundal/Channa Sundal", "Tea/Coffee/Milk", "Bread/Butter/Jam","Masala kashayam"], dinner: ["Chappathi", "Mix Veg Curry", "Dal Fry", "Chicken Gravy", "Steamed Rice", "Kadamba Sambar", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Cone Ice Cream**"] },
  }
};

function App() {
  const isMobile = useIsMobile();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  
  const {
    selectedMess,
    currentTime,
    mealNavigation,
    notificationsEnabled,
    isLoading,
    compactMode,
    setSelectedMess,
    updateCurrentTime,
    navigateToPreviousMeal,
    navigateToNextMeal,
    goLive,
    setMealNavigation,
    initialize,
  } = useAppStore();

  // Bottom navigation state
  const { activeSection, navigateToSection } = useBottomNavigation('home');
  const { showHome, showCalendar, showFavorites, showSettings } = useSectionVisibility(activeSection);

  // Offline data handling
  const { isOnline, cachedData, cacheMenuData } = useOfflineData();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize store
        initialize();
        
        // Initialize notification service
        if (notificationsEnabled) {
          await notificationService.requestPermission();
        }
        
        // Simulate loading time for smooth UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsAppReady(true);
        setTimeout(() => setIsInitialLoading(false), 300);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsAppReady(true);
        setIsInitialLoading(false);
      }
    };

    initializeApp();
  }, [initialize, notificationsEnabled]);

  // Live clock effect
  useEffect(() => {
    if (!isAppReady) return;
    
    const timer = setInterval(() => {
      updateCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [updateCurrentTime, isAppReady]);

  // Get meal and day label
  const date = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + mealNavigation.dayOffset);
  const schedule = getScheduleForDay(date);
  const meal = schedule[mealNavigation.mealIndex] || schedule[0];
  
  // Use cached data if offline, otherwise use live data
  const effectiveMenuData = isOnline ? menuData : (cachedData || menuData);
  const menuItems = effectiveMenuData[selectedMess][getDayKey(date)]?.[meal.name.toLowerCase()] || [];
  const dayLabel = getDayLabel(mealNavigation.dayOffset, currentTime);

  // Cache menu data when online
  useEffect(() => {
    if (isOnline) {
      cacheMenuData(menuData);
    }
  }, [isOnline, cacheMenuData]);

  // Handle date selection for compact mode
  const handleDateSelect = (newDate) => {
    const today = new Date();
    
    // Simple day difference calculation
    const todayDate = today.getDate();
    const newDateDate = newDate.getDate();
    const todayMonth = today.getMonth();
    const newDateMonth = newDate.getMonth();
    const todayYear = today.getFullYear();
    const newDateYear = newDate.getFullYear();
    
    // Calculate days difference
    let diffDays = 0;
    
    if (newDateYear === todayYear && newDateMonth === todayMonth) {
      // Same month and year
      diffDays = newDateDate - todayDate;
    } else {
      // Different month or year - use the time-based calculation
      const todayStart = new Date(todayYear, todayMonth, todayDate);
      const newDateStart = new Date(newDateYear, newDateMonth, newDateDate);
      const diffTime = newDateStart.getTime() - todayStart.getTime();
      diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // Update the meal navigation to reflect the selected date
    setMealNavigation(diffDays, 0, false);
  };

  // Initialize notifications (after menuItems is defined)
  useMealTimeNotifications(mealNavigation, currentTime, menuItems, notificationsEnabled);
  useMenuUpdateNotifications(notificationsEnabled);

  // Show initial loading screen
  if (isInitialLoading) {
    return <PageLoadingState message="Preparing your delicious menu..." />;
  }

  // Show app loading skeleton if data is still loading
  if (isLoading || !isAppReady) {
    return <AppLoadingState />;
  }

  return (
    <ErrorBoundary>
      <SkipLinks />
      <PageTransition className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col w-full transition-colors duration-200">
      <FadeIn delay={0.1}>
        <Header currentTime={currentTime} />
      </FadeIn>
      
      <SlideUp delay={0.2}>
        <div className="flex items-center justify-between mt-4 mb-4 px-4">
          {/* Left spacer */}
          <div className="flex-1" />
          
          {/* Center - Block Selector */}
          <BlockSelector
            selectedMess={selectedMess}
            onMessChange={setSelectedMess}
            className=""
          />
          
          {/* Right - Compact Button */}
          <div className="flex-1 flex justify-end">
            <CompactModeToggle />
          </div>
        </div>
      </SlideUp>
      
      {/* Main Content */}
      <main 
        id="main-content"
        className="flex-1 flex flex-col justify-start p-4 w-full pb-20 overflow-y-auto"
        role="main"
      >
        {/* Home Section - Default Meal View */}
        {showHome && (
          <StaggerContainer staggerDelay={0.1} className="w-full">
            {compactMode ? (
              // Compact Mode View
              <>
                <StaggerItem>
                  <DaySelector
                    selectedDate={date}
                    onDateSelect={handleDateSelect}
                    className="mb-4"
                  />
                </StaggerItem>
                
                <StaggerItem>
                  <CompactMealView
                    date={date}
                    menuItems={effectiveMenuData[selectedMess][getDayKey(date)] || {}}
                    className="w-full"
                  />
                </StaggerItem>
              </>
            ) : (
              // Normal Mode View
              <>
                <StaggerItem>
                  <Navigation
                    meal={meal}
                    dayLabel={dayLabel}
                    isLive={mealNavigation.isLive}
                    onPrevious={navigateToPreviousMeal}
                    onNext={navigateToNextMeal}
                    onGoLive={goLive}
                    className="mb-4"
                  />
                </StaggerItem>
                
                <StaggerItem>
                  {/* Swipeable Meal Card */}
                  <SwipeableContainer
                    onNext={navigateToNextMeal}
                    onPrevious={navigateToPreviousMeal}
                    className="w-full"
                  >
                    <MealCard
                      meal={meal}
                      menuItems={menuItems}
                      dayLabel={dayLabel}
                      showHorizontalScroll={false}
                    />
                  </SwipeableContainer>
                </StaggerItem>
              </>
            )}
          </StaggerContainer>
        )}

        {/* Calendar Section */}
        {showCalendar && (
          <Suspense fallback={<PageLoadingState message="Loading calendar..." />}>
            <CalendarSection 
              className="w-full"
              menuData={menuData}
            />
          </Suspense>
        )}

        {/* Favorites Section */}
        {showFavorites && (
          <Suspense fallback={<PageLoadingState message="Loading favorites..." />}>
            <FavoritesSection className="w-full" />
          </Suspense>
        )}

        {/* Settings Section */}
        {showSettings && (
          <Suspense fallback={<PageLoadingState message="Loading settings..." />}>
            <SettingsSection className="w-full" />
          </Suspense>
        )}
      </main>
      {/* Desktop Footer - Hidden on Mobile */}
      {!isMobile && (
        <FadeIn delay={0.5}>
          <footer 
            id="footer"
            className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 py-2 w-full bg-white bg-opacity-80 backdrop-blur-sm fixed bottom-0 left-0 z-40 dark:bg-gray-900/80"
            role="contentinfo"
          >
                          <div className="flex gap-3 mb-0.5">
                <a href="https://instagram.com/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 text-base transition-colors">
                  <Instagram style={{ display: 'inline-block' }} />
                  <InstagramIcon />
                </a>
                <a href="https://github.com/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-gray-900 dark:hover:text-white text-base transition-colors">
                  <Github style={{ display: 'inline-block' }} />
                  <GithubIcon />
                </a>
                <a href="https://linkedin.com/in/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 text-base transition-colors">
                  <Linkedin style={{ display: 'inline-block' }} />
                  <LinkedinIcon />
                </a>
              </div>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <span className="text-red-500 text-sm">♥</span>
              <span>Gowthamrdyy</span>
            </div>
          </footer>
        </FadeIn>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        id="navigation"
        currentSection={activeSection}
        onNavigate={navigateToSection}
      />
      
      <Analytics />
      
      {/* PWA Components */}
      <PWAInstallPrompt />
      <OfflineIndicator />
      
      {/* Notification System */}
      <NotificationSystem />
      
      {/* Performance Monitor (Development Only) */}
      <PerformanceMonitor />
      </PageTransition>
    </ErrorBoundary>
  );
}

export default App;
