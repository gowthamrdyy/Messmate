import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Button from './Button';

const NotificationSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notificationsEnabled, toggleNotifications } = useAppStore();

  // Manual HTML icons as fallbacks
  const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
      <path d="m13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );

  const BellOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      <path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path>
      <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path>
      <path d="M18 8a6 6 0 0 0-9.33-5"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notification settings"
      >
        {notificationsEnabled ? (
          <>
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" style={{ display: 'inline-block' }} />
            <BellIcon />
          </>
        ) : (
          <>
            <BellOff className="w-5 h-5 text-gray-400 dark:text-gray-600" style={{ display: 'inline-block' }} />
            <BellOffIcon />
          </>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleNotifications}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      notificationsEnabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {notificationsEnabled ? 'ON' : 'OFF'}
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about meal times and menu updates with flirty messages! 😘
                </p>

                {notificationsEnabled && (
                  <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      You'll get notified about meal times and when your favorite items are available! 🍽️
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSettings;