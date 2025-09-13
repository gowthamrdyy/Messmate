import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Heart, Settings, Bell } from 'lucide-react';
import { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { useIsMobile } from '../../hooks/useMediaQuery';

const BottomNavigation = ({ 
  className = '',
  onNavigate,
  currentSection = 'home'
}) => {
  const { favorites, notificationsEnabled } = useAppStore();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(currentSection);

  // Manual HTML icons as fallbacks
  const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M8 2v4"></path>
      <path d="M16 2v4"></path>
      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
      <path d="M3 10h18"></path>
    </svg>
  );

  const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  // Navigation items configuration
  const navigationItems = [
    {
      id: 'home',
      label: 'Menu',
      icon: Home,
      fallbackIcon: HomeIcon,
      badge: null,
      color: 'blue'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      fallbackIcon: CalendarIcon,
      badge: null,
      color: 'green'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      fallbackIcon: HeartIcon,
      badge: favorites.length > 0 ? favorites.length : null,
      color: 'red'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      fallbackIcon: SettingsIcon,
      badge: notificationsEnabled ? null : '!',
      color: 'gray'
    }
  ];

  const handleTabPress = (itemId) => {
    setActiveTab(itemId);
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
        border-t border-gray-200/50 dark:border-gray-700/50
        safe-area-inset-bottom
        ${className}
      `}
    >
      {/* Safe area padding for devices with home indicator */}
      <div className="px-4 pt-2 pb-safe">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const FallbackIcon = item.fallbackIcon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleTabPress(item.id)}
                className="relative flex flex-col items-center justify-center p-2 min-w-[60px]"
                whileTap={{ scale: 0.95 }}
                aria-label={item.label}
              >
                {/* Active indicator background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        absolute inset-0 rounded-xl
                        ${item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          item.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                          item.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                          'bg-gray-100 dark:bg-gray-800/50'
                        }
                      `}
                    />
                  )}
                </AnimatePresence>

                {/* Icon container with badge */}
                <div className="relative z-10 mb-1">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon
                      size={20}
                      className={`
                        transition-colors duration-200
                        ${isActive 
                          ? item.color === 'blue' ? 'text-blue-600 dark:text-blue-300' :
                            item.color === 'green' ? 'text-green-600 dark:text-green-300' :
                            item.color === 'red' ? 'text-red-600 dark:text-red-300' :
                            'text-gray-800 dark:text-gray-200'
                          : 'text-gray-600 dark:text-gray-300'
                        }
                      `}
                    />
                  </motion.div>

                  {/* Badge */}
                  <AnimatePresence>
                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`
                          absolute -top-1 -right-1 min-w-[16px] h-4
                          flex items-center justify-center
                          text-xs font-medium text-white
                          rounded-full px-1
                          ${item.color === 'red' ? 'bg-red-500' : 'bg-blue-500'}
                        `}
                      >
                        {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Label */}
                <motion.span
                  animate={{
                    color: isActive 
                      ? item.color === 'blue' ? '#2563eb' :
                        item.color === 'green' ? '#16a34a' :
                        item.color === 'red' ? '#dc2626' :
                        '#374151'
                      : '#6b7280'
                  }}
                  className="text-caption font-medium text-gray-600 dark:text-gray-400"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;