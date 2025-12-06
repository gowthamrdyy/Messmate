import { useEffect, useState, lazy, Suspense } from 'react';
import './App.css';
import { Instagram, Github, Linkedin } from 'lucide-react';
import Header from './components/ui/Header';
import BlockSelector from './components/ui/BlockSelector';
import CompactModeToggle from './components/ui/CompactModeToggle';
import QuantumMenuCard from './components/ui/QuantumMenuCard';
import CompactMealView from './components/ui/CompactMealView';
import QuickSearch from './components/ui/QuickSearch';
import MealTimingAlert from './components/ui/MealTimingAlert';


import DaySelector from './components/ui/DaySelector';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';
import OfflineIndicator from './components/ui/OfflineIndicator';
import { PageLoadingState, AppLoadingState } from './components/ui/LoadingState';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from './components/ui/PageTransition';
import ErrorBoundary from './components/ui/ErrorBoundary';
import BottomNavigation from './components/ui/BottomNavigation';
import PerformanceMonitor from './components/ui/PerformanceMonitor';
import SkipLinks from './components/ui/SkipLinks';

import { useBottomNavigation, useSectionVisibility } from './hooks/useBottomNavigation';
import useOfflineData from './hooks/useOfflineData';
import useAppStore from './store/useAppStore';

import { getScheduleForDay } from './utils/mealSchedule';
import { getDayLabel, getDayKey } from './utils/dateHelpers';
import { useIsMobile } from './hooks/useMediaQuery';

// Lazy load heavy sections for code splitting
const FavoritesSection = lazy(() => import('./components/sections/FavoritesSection'));
const CalendarSection = lazy(() => import('./components/sections/CalendarSection'));
const SettingsSection = lazy(() => import('./components/sections/SettingsSection'));

// Sample menu data for both messes and all days - Standardized to match Wednesday's size
const menuData = {
  sannasi: {
    monday: { breakfast: ["Sweet", "Bread,Butter,Jam", "Pongal", "Sambar", "Vada", "Poori", "Aloo Dal Masala", "Tea/Coffee/Milk", "Boiled Egg", "Banana"], lunch: ["Chappathi", "Chapp kasa", "Jeera Pulao", "Steamed Rice", "Masala Sambhar", "Bagara Dal", "Mix veg Usili", "Lemon rasam", "Pickle", "Butter Milk", "Fryums"], snacks: ["Pav Bajji", "Tea/Coffee"], dinner: ["Punjabi paratha", "Rajma Makkan wala", "Dosa", "Idli podi", "Oil", "Special Chutney", "Steamed rice", "Vegetable dal", "Rasam", "Pickle", "Fryums", "Veg-Salad", "**Mutton Gravy**"] },
    tuesday: { breakfast: ["Bread,Butter,Jam", "Idly", "Spl chutney", "Veg kosthu", "Coconut chutney", "Poha", "Mint chutney", "Masala Omlet", "Tea/Coffee/Milk", "Banana"], lunch: ["Sweet", "Poori", "Mattar Ghughni", "Variety rice", "Steamed rice", "Sambhar", "Dal Lasooni", "Tomato", "Rasam", "Gobi-65/Bhinidi Jaipuri", "Fryums", "Butter milk", "Pickle"], snacks: ["Boiled Peanut/Black channa sundal", "Tea/Coffee"], dinner: ["Chappathi", "Mixveg kurma", "Friedrice/Noodles", "Manchurian Dry/Crispy Veg", "Steamed Rice", "Rasam", "Dal fry", "Pickle", "Fryums", "Veg Salad", "Milk", "spl fruits", "**Chicken Gravy**"] },
    wednesday: { breakfast: ["Bread,Butter,Jam", "Dosa", "Idly Podi", "Oil", "Arichuvita Sambhar", "Chutney", "Chappathi", "Aloo Rajma Masala", "Tea/Coffee/Milk", "Banana"], lunch: ["Butter Roti", "Aloo Palak", "Peas Pulao", "Dal Makhni", "Kadai Veggies", "Steamed Rice", "Drumstick Brinjal", "Sambhar", "Garlic Rasam", "Butter milk", "Fryums"], snacks: ["Veg Puff/Sweet Puff", "Coffee/Tea"], dinner: ["Chappathi", "Steamed rice", "Chicken Masala/Paneer Butter Masala", "Rasam", "Pickle", "Fryums", "Veg Salad", "**Chicken gravy**"] },
    thursday: { breakfast: ["Bread,Butter,Jam", "Chappathi", "Aloo Meal Maker Kasa", "Veg semiya Kichidi", "Coconut Chutney", "Boiled Egg", "Tea/Coffee/Milk", "Banana"], lunch: ["Luchi", "Kashmiri Dum Aloo", "Onion Pulao", "Steamed Rice", "Mysore Dal Fry", "Kadai Pakoda", "Pepper Rasam", "Poriyal", "Pickle", "Fryums", "Butter Milk"], snacks: ["Pani Puri/Chunda Nasta", "Coffee/Tea"], dinner: ["Ghee Pulao/Kaju Pulao(Basmati Rice)", "Chappathi", "Muttar Panner", "Steamed Rice", "Tadka Dal", "Rasam", "Aloo Peanut Masala", "Fryums", "Milk", "Pickle", "veg Salad", "**Mutton Gravy**"] },
    friday: { breakfast: ["Bread,Butter,Jam", "Podi Dosa", "Idly Podi", "Oil", "Chilli Sambar", "Chutney", "Chappathi", "Muttar Masala", "Tea/Coffee/Milk", "Boiled Egg", "Banana"], lunch: ["Dry Jamun/Bread Halwa", "Veg Biryani", "Mix Raitha", "Bisbelabath", "Curd Rice", "Steamed Rice", "Tomato Rasam", "Aloo Gobi Adarki", "Moongdal Tadka", "Pickle", "Fryums"], snacks: ["Bonda/Vada", "Chutney", "Coffee/Tea"], dinner: ["Chole Bhatura", "Steamed Rice", "Tomato dal", "Sambha Rava Upma", "Coconut Chutney", "Rasam", "Cabbage Poriyal", "Pickle", "Fryums", "Veg salad", "Milk", "**Chicken Gravy**"] },
    saturday: { breakfast: ["Bread,Butter,Jam", "Chappathi", "Veg Khurma", "Idiyappam(Lemon/Masala)", "Coconut Chutney", "Tea/Coffee/Milk", "Boiled Egg", "Banana"], lunch: ["Poori", "Dal Aloo Masala", "Veg Pulao", "Steamed Rice", "Punjabi Dal Tadka", "Bhindi Do Pyasa", "Kara Kuzhambu", "Kootu", "Jeera Rasam", "Pickle", "Special Fryums", "Butter Milk"], snacks: ["Cake/Brownie", "Coffee/Tea"], dinner: ["Sweet", "Malabar Paratha", "Meal maker Curry", "Mix Vegetable Sabji", "Steamed Rice", "Dal Makhini", "Rasam", "Idli", "Idli Podi", "Sambhar", "Oil", "Fryums", "Pickle", "Veg Salad", "**Fish Gravy**"] },
    sunday: { breakfast: ["Bread,Butter,Jam", "Chole Puri", "Veg Upma", "Coconut Chutney", "Tea/Coffee/Milk", "Banana"], lunch: ["Chappathi", "Chicken (Pepper/Kadai)", "Panner Butter Masala/Kadai Panner", "Dal Dhadka", "Mint Pulao", "Steamed Rice", "Garlic Rasam", "Poriyal", "Pickle", "Butter Milk", "Fryums", "**Chicken Gravy**"], snacks: ["Corn/Bajji", "Chutney", "Coffee/Tea"], dinner: ["Variety Stuffing Paratha", "Curd", "Steamed Rice", "Hara Moong Dal Tadka", "Kathamba Sambhar", "Poriyal", "Rasam", "Pickle", "Fryums", "Veg Salad", "Milk", "Ice cream", "**Chicken Gravy**"] },
  },
  mblock: {
    monday: { breakfast: ["Bread,Butter,Jam", "Pongal", "Sambar", "Coconut Chutney", "Vada", "Chappathi", "Soya Aloo Kasha", "Tea/Coffee/Milk", "Banana"], lunch: ["Mint Chappathi", "Black Channa Masala", "Mutter Pulao", "Dal Makhni", "Steamed Rice", "Arachivitta Sambar", "Keerai Kootu", "Rasam", "Buttermilk", "Fryums", "Pickle"], snacks: ["Samosa/Veg Spring Roll", "Tea/Lemon Juice/Milk", "Bread/Butter/Jam", "Pepper kashayam"], dinner: ["Chappathi", "Tomato Dal", "Idli", "Chutney", "Sambar", "Idli Podi", "Oil", "Steamed Rice", "Rasam", "Buttermilk", "Pickle", "Salad", "Milk", "**Fish Gravy**"] },
    tuesday: { breakfast: ["Bread,Butter,Jam", "Poori", "Aloo Masala", "Veg Rava Kitchadi", "Sambar", "Chutney", "Tea/Coffee/Milk", "Banana"], lunch: ["Payasam", "Chappathi", "White Peas Curry", "Jeera Pulao", "Dal Fry", "Steamed Rice", "Kara Kuzhambu", "Rasam", "Cabbage Kootu", "Buttermilk", "Fryums", "Pickle"], snacks: ["Pani Pori/Pav Bhaji", "Tea/Coffee/Milk", "Bread/Butter/Jam", "Coriander kashayam"], dinner: ["Millet Chappathi", "Black Channa Masala", "Dosa", "Sambar", "Chutney", "Idli Podi", "Oil", "Steamed Rice", "Rasam", "Buttermilk", "Salad", "Pickle", "Milk", "**Mutton Kulambu**"] },
    wednesday: { breakfast: ["Bread,Butter,Jam", "Idiyappam", "Vada Curry/Veg Stew", "Mint Chutney", "Poha", "Tea/Coffee/Milk", "Banana"], lunch: ["Chappathi", "Rajma Masala", "Variety Rice", "Curd Rice", "Urulai Kara Masala", "Steamed Rice", "Rasam", "Appalam", "Pickle"], snacks: ["Bakery Snacks", "Tea/Coffee/Milk", "Bread/Butter/Jam", "Ginger kashayam"], dinner: ["Chappathi", "Paneer Butter Masala", "Steamed Rice", "Sambar", "Jeera Rasam", "Buttermilk", "Pickle", "Milk", "**Chicken Gravy/Chicken Biryani**"] },
    thursday: { breakfast: ["Bread,Butter,Jam", "Idli", "Groundnut Chutney", "Sambar", "Chappathi", "White Peas Masala", "Tea/Coffee/Milk", "Banana"], lunch: ["Sweet Pongal/Boondhi", "Beetroot Chappathi", "Gobi Capsicum", "Dal Fry", "Veg Pulao", "Steamed Rice", "Karakulambu", "Keerai Kootu", "Rasam", "Buttermilk", "Fryums", "Pickle"], snacks: ["Navadhaniya Sundal", "Tea/Coffee/Milk", "Bread/Butter/Jam", "Jeera kashayam"], dinner: ["Chole Poori", "Channa Masala", "Dosa", "Sambar", "Chutney", "Steamed Rice", "Rasam", "Buttermilk", "Onion Salad", "Pickle", "Milk", "**Cup Ice Cream**", "**Chicken Gravy**"] },
    friday: { breakfast: ["Bread,Butter,Jam", "Chappathi", "Channa Dal", "Kal Dosa", "Sambar", "Chutney", "Omelette", "Tea/Coffee/Milk", "Banana", "Idli Podi", "Oil"], lunch: ["Chappathi", "Dal Tadka", "Peas Pulao", "Spinach Aloo", "Steamed Rice", "Sambar", "Mix Veg Poriyal", "Rasam", "Buttermilk", "Fryums", "Pickle"], snacks: ["Bajji/Mysore Bonda", "Chutney", "Tea/Rose Milk", "Bread/Butter/Jam", "Sukkiu kashayam"], dinner: ["Veg Soup", "Chappathi", "Veg Manchurian Gravy", "Fried Rice/Noodles", "Dal Fry", "Steamed Rice", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Chicken Gravy**"] },
    saturday: { breakfast: ["Bread,Butter,Jam", "Aloo Paratha", "Curd", "Idli", "Sambar", "Groundnut Chutney", "Tea/Coffee/Milk", "Banana", "Boiled Egg"], lunch: ["Gulab Jamun/Millet Payasam", "Chappathi", "Meal Maker Curry", "Veg Biryani", "Raitha", "Curd Rice", "Steamed Rice", "Rasam", "Keerai Kootu", "Fryums", "Pickle"], snacks: ["Cake Variety", "Tea/Coffee/Milk", "Bread/Butter/Jam", "Nilavembu kashayam"], dinner: ["Paratha", "Veg Salna", "Dosa", "Chutney", "Tiffin Sambar", "Idli Podi", "Oil", "Steamed Rice", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Mutton Gravy**"] },
    sunday: { breakfast: ["Bread,Butter,Jam", "Chole Bhature", "Chenna Masala", "Rava Upma", "Coconut Chutney", "Sambar", "Tea/Coffee/Milk", "Seasonal Fruit"], lunch: ["Chappathi", "Chicken Gravy", "Paneer Mutter Kasa", "Sambar", "Steamed Rice", "Dal Fry", "Rasam", "Poriyal", "Buttermilk", "Milk", "Pickle", "Fryums"], snacks: ["Peanut Sundal/Channa Sundal", "Tea/Coffee/Milk", "Bread/Butter/Jam", "Masala kashayam"], dinner: ["Chappathi", "Mix Veg Curry", "Dal Fry", "Chicken Gravy", "Steamed Rice", "Kadamba Sambar", "Rasam", "Buttermilk", "Milk", "Salad", "Pickle", "**Cone Ice Cream**"] },
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
  }, [initialize]);

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

      {/* Nebula Background */}
      <div className="fixed inset-0 z-[-1] bg-surface-200 dark:bg-nebula-dark transition-colors duration-500">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-nebula-primary/20 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-nebula-secondary/20 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-nebula-accent/10 blur-[80px] animate-float" />
      </div>

      <div className="h-[100dvh] flex flex-col w-full transition-all duration-500 overflow-hidden">
        <FadeIn delay={0.1}>
          <Header currentTime={currentTime} />
        </FadeIn>

        <SlideUp delay={0.2}>
          <div className="flex items-center justify-between mt-6 mb-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
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
          className="flex-1 flex flex-col justify-start p-4 md:p-8 w-full pb-24 md:pb-8 overflow-y-auto overflow-x-hidden max-h-full max-w-7xl mx-auto"
          role="main"
        >
          {/* Home Section - Default Meal View */}
          {showHome && (
            <StaggerContainer staggerDelay={0.1} className="w-full space-y-6">
              {/* Quick Search */}
              <StaggerItem>
                <QuickSearch
                  menuData={effectiveMenuData}
                  selectedMess={selectedMess}
                  onItemClick={(result) => {
                    console.log('Search result clicked:', result);
                  }}
                  className="w-full"
                />
              </StaggerItem>

              {/* Meal Timing Alert */}
              <StaggerItem>
                <MealTimingAlert
                  currentTime={currentTime}
                  className="w-full"
                />
              </StaggerItem>



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
                // Nebula Mode View (formerly Quantum)
                <>
                  <StaggerItem>
                    <QuantumMenuCard
                      meal={meal}
                      menuItems={menuItems}
                      dayLabel={dayLabel}
                      currentDate={date}
                      onPrevious={navigateToPreviousMeal}
                      onNext={navigateToNextMeal}
                      onGoLive={goLive}
                      isLive={mealNavigation.isLive}
                      disabled={isLoading}
                      className="w-full"
                    />
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
              <FavoritesSection
                className="w-full"
                menuData={effectiveMenuData}
                selectedMess={selectedMess}
              />
            </Suspense>
          )}

          {/* Settings Section */}
          {showSettings && (
            <Suspense fallback={<PageLoadingState message="Loading settings..." />}>
              <SettingsSection className="w-full" menuData={effectiveMenuData} />
            </Suspense>
          )}
        </main>

        {/* Desktop Footer - Hidden on Mobile */}
        {!isMobile && (
          <FadeIn delay={0.5}>
            <footer
              id="footer"
              className="flex flex-col items-center justify-center gap-2 text-sm text-text-tertiary py-6 w-full bg-surface-100/80 backdrop-blur-md border-t border-glass-border"
              role="contentinfo"
            >
              <div className="flex gap-4 mb-1">
                <a href="https://instagram.com/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-nebula-secondary transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://github.com/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-text-primary transition-colors">
                  <Github size={18} />
                </a>
                <a href="https://linkedin.com/in/gowthamrdyy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-nebula-accent transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span>Made with</span>
                <span className="text-nebula-error animate-pulse">♥</span>
                <span>by Gowthamrdyy</span>
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

        {/* PWA Components */}
        <PWAInstallPrompt />
        <OfflineIndicator />

        {/* Performance Monitor (Development Only) */}
        <PerformanceMonitor />
      </div>
    </ErrorBoundary>
  );
}

export default App;