import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Heart, Settings } from 'lucide-react';
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

  // Navigation items configuration
  const navigationItems = [
    {
      id: 'home',
      label: 'Menu',
      icon: Home,
      badge: null,
      activeColor: 'text-nebula-primary',
      bgColor: 'bg-nebula-primary/10'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      badge: null,
      activeColor: 'text-nebula-success',
      bgColor: 'bg-nebula-success/10'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      badge: favorites.length > 0 ? favorites.length : null,
      activeColor: 'text-nebula-secondary',
      bgColor: 'bg-nebula-secondary/10'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: notificationsEnabled ? null : '!',
      activeColor: 'text-nebula-accent',
      bgColor: 'bg-nebula-accent/10'
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
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className={`
          pointer-events-auto
          bg-surface-100/90 dark:bg-nebula-dark/90 backdrop-blur-xl
          border border-white/20 dark:border-white/10
          shadow-float rounded-2xl
          px-2 py-2
          ${className}
        `}
      >
        <div className="flex items-center gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleTabPress(item.id)}
                className={`
                  relative flex flex-col items-center justify-center
                  w-16 h-14 rounded-xl transition-colors duration-300
                  ${isActive ? item.bgColor : 'hover:bg-surface-200/50 dark:hover:bg-white/5'}
                `}
                whileTap={{ scale: 0.9 }}
              >
                {/* Icon container */}
                <div className="relative z-10">
                  <Icon
                    size={24}
                    className={`
                      transition-all duration-300
                      ${isActive ? item.activeColor : 'text-text-tertiary'}
                    `}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* Badge */}
                  <AnimatePresence>
                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-nebula-error rounded-full border-2 border-surface-100 dark:border-nebula-dark"
                      >
                        {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Active Dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className={`absolute bottom-1.5 w-1 h-1 rounded-full ${item.activeColor.replace('text-', 'bg-')}`}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default BottomNavigation;