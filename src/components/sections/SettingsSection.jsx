import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Smartphone, Monitor, Palette, Info, Instagram } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { StaggerContainer, StaggerItem } from '../ui/PageTransition';
import { useTheme } from '../../hooks/useTheme';
import useAppStore from '../../store/useAppStore';
import { APP_CONFIG } from '../../utils/constants';
import PushNotificationSettings from '../ui/PushNotificationSettings';

const SettingsSection = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { 
    compactMode,
    toggleCompactMode,
    selectedMess,
    setSelectedMess
  } = useAppStore();

  // Manual HTML icons as fallbacks
  const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const PaletteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <circle cx="13.5" cy="6.5" r=".5"></circle>
      <circle cx="17.5" cy="10.5" r=".5"></circle>
      <circle cx="8.5" cy="7.5" r=".5"></circle>
      <circle cx="6.5" cy="12.5" r=".5"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    </svg>
  );

  const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  );

  const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  );

  const SmartphoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
      <path d="M12 18h.01"></path>
    </svg>
  );

  const MonitorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <rect width="20" height="14" x="2" y="3" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  );

  const InfoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
  );

  const settingsGroups = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          id: 'theme',
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'toggle',
          value: theme === 'dark',
          onChange: toggleTheme,
          icons: { on: Moon, off: Sun },
          labels: { on: 'Dark', off: 'Light' }
        },
        {
          id: 'compact',
          label: 'Compact Mode',
          description: 'Show all meals for a day in one view',
          type: 'toggle',
          value: compactMode,
          onChange: toggleCompactMode,
          icons: { on: Smartphone, off: Monitor },
          labels: { on: 'Compact', off: 'Normal' }
        }
      ]
    },

    {
      title: 'Preferences',
      icon: Settings,
      items: [
        {
          id: 'mess',
          label: 'Default Mess',
          description: 'Choose your preferred mess hall',
          type: 'select',
          value: selectedMess,
          onChange: setSelectedMess,
          options: [
            { value: 'sannasi', label: 'Sannasi Mess' },
            { value: 'mblock', label: 'M-Block Mess' }
          ]
        }
      ]
    }
  ];

  const renderToggleItem = (item) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {item.label}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {item.description}
        </p>
      </div>
      
      <Button
        variant={item.value ? 'primary' : 'outline'}
        size="sm"
        onClick={item.onChange}
        className="flex items-center gap-2 min-w-[100px]"
      >
        {item.value ? (
          <>
            <item.icons.on size={16} style={{ display: 'inline-block' }} />
            {item.id === 'theme' && <MoonIcon />}
            {item.id === 'compact' && <SmartphoneIcon />}
            {item.labels.on}
          </>
        ) : (
          <>
            <item.icons.off size={16} style={{ display: 'inline-block' }} />
            {item.id === 'theme' && <SunIcon />}
            {item.id === 'compact' && <MonitorIcon />}
            {item.labels.off}
          </>
        )}
      </Button>
    </div>
  );

  const renderSelectItem = (item) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {item.label}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {item.description}
        </p>
      </div>
      
      <select
        value={item.value}
        onChange={(e) => item.onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {item.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <>
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" style={{ display: 'inline-block' }} />
              <SettingsIcon />
            </>
            Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <StaggerContainer staggerDelay={0.1}>
            <div className="space-y-6">
              {settingsGroups.map((group) => (
                <StaggerItem key={group.title}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                      <>
                        <group.icon size={18} className="text-gray-500 dark:text-gray-400" style={{ display: 'inline-block' }} />
                        {group.title === 'Appearance' && <PaletteIcon />}
                        {group.title === 'Preferences' && <SettingsIcon />}
                      </>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {group.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                          className="p-3 rounded-lg transition-colors"
                        >
                          {item.type === 'toggle' && renderToggleItem(item)}
                          {item.type === 'select' && renderSelectItem(item)}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              ))}

              {/* Push Notification Settings */}
              <StaggerItem>
                <PushNotificationSettings />
              </StaggerItem>

              {/* App Info */}
              <StaggerItem>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <>
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <InfoIcon />
                      </>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        {APP_CONFIG.name} v{APP_CONFIG.version}
                      </h4>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {APP_CONFIG.description}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      Made with ❤️ for SRM students
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>

              {/* Developer Branding */}
              <StaggerItem>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex items-center gap-4">
                    {/* Profile Photo */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <img
                        src="/gowthamrdyy-profile.jpg"
                        alt="Gowthamrdyy"
                        className="w-12 h-12 rounded-full border-2 border-purple-300 dark:border-purple-600 shadow-lg object-cover"
                        onError={(e) => {
                          // Fallback to a default avatar if image fails to load
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B5CF6'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                        }}
                      />
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Instagram className="w-3 h-3 text-white" />
                      </motion.div>
                    </motion.div>
                    
                    {/* Branding Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-lg leading-tight">
                        Made by Gowthamrdyy
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1 leading-relaxed">
                        AIML Developer & Designer
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                          Follow me on Instagram
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Instagram className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Clickable Instagram Link */}
                  <motion.a
                    href="https://instagram.com/gowthamrdyy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-center font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Instagram className="w-4 h-4" />
                      <span>Follow @gowthamrdyy</span>
                    </div>
                  </motion.a>
                </motion.div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsSection;