import { useEffect, useState } from 'react';

const useOfflineData = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data on mount
    const loadCachedData = () => {
      const cached = localStorage.getItem('messmate_menu_data');
      if (cached) {
        try {
          setCachedData(JSON.parse(cached));
        } catch (error) {
          console.error('Error parsing cached data:', error);
        }
      }
    };

    loadCachedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheMenuData = (menuData) => {
    try {
      localStorage.setItem('messmate_menu_data', JSON.stringify(menuData));
      setCachedData(menuData);
    } catch (error) {
      console.error('Error caching menu data:', error);
    }
  };

  const getCachedData = () => {
    return cachedData;
  };

  const clearCache = () => {
    localStorage.removeItem('messmate_menu_data');
    setCachedData(null);
  };

  return {
    isOnline,
    cachedData,
    cacheMenuData,
    getCachedData,
    clearCache
  };
};

export default useOfflineData;
