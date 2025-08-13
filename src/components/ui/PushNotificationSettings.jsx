import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Settings, Clock, Star, AlertCircle } from 'lucide-react';
import usePushNotifications from '../../hooks/usePushNotifications';
import Glass from './Glass';
import Button from './Button';

const PushNotificationSettings = ({ className = '' }) => {
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
    canSubscribe,
    canUnsubscribe,
    canSendNotifications
  } = usePushNotifications();

  // Manual HTML icons as fallbacks
  const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

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

  const AlertCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  const [preferences, setPreferences] = useState({
    mealReminders: true,
    menuUpdates: true,
    specialMeals: true,
    testNotifications: false
  });

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubscribe = async () => {
    await subscribe();
  };

  const handleUnsubscribe = async () => {
    await unsubscribe();
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
  };

  if (!isSupported) {
    return (
      <Glass className={`p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <>
            <AlertCircle className="text-orange-500" size={24} style={{ display: 'inline-block' }} />
            <AlertCircleIcon />
          </>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Push Notifications Not Supported
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Safari.
        </p>
      </Glass>
    );
  }

  return (
    <Glass className={`p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <>
          <Settings className="text-blue-500" size={24} style={{ display: 'inline-block' }} />
          <SettingsIcon />
        </>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Push Notifications
        </h3>
      </div>

      {/* Status Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <>
                <Bell className="text-green-500" size={20} style={{ display: 'inline-block' }} />
                <BellIcon />
              </>
            ) : (
              <>
                <BellOff className="text-gray-400" size={20} style={{ display: 'inline-block' }} />
                <BellOffIcon />
              </>
            )}
            <span className="font-medium text-gray-900 dark:text-white">
              {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
            </span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            permission === 'granted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            permission === 'denied' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {permission === 'granted' ? 'Granted' : 
             permission === 'denied' ? 'Denied' : 'Default'}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {canSubscribe && (
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="flex-1"
              variant="primary"
            >
              {isLoading ? 'Subscribing...' : 'Enable Notifications'}
            </Button>
          )}
          
          {canUnsubscribe && (
            <Button
              onClick={handleUnsubscribe}
              disabled={isLoading}
              className="flex-1"
              variant="secondary"
            >
              {isLoading ? 'Unsubscribing...' : 'Disable Notifications'}
            </Button>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      {isSubscribed && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h4>
          
          <div className="space-y-3">
            <motion.label 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                checked={preferences.mealReminders}
                onChange={() => handlePreferenceChange('mealReminders')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <Clock className="text-blue-500" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Meal Time Reminders</span>
            </motion.label>

            <motion.label 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                checked={preferences.menuUpdates}
                onChange={() => handlePreferenceChange('menuUpdates')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <Settings className="text-green-500" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Menu Updates</span>
            </motion.label>

            <motion.label 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                checked={preferences.specialMeals}
                onChange={() => handlePreferenceChange('specialMeals')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <Star className="text-yellow-500" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Special Meals</span>
            </motion.label>
          </div>
        </div>
      )}




    </Glass>
  );
};

export default PushNotificationSettings;
