import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Smartphone, Monitor, Palette, Info, Download, Trash2, RefreshCw, Database, Users, Star, ChevronRight, Bell, Languages } from 'lucide-react';
import RateFoodModal from '../ui/RateFoodModal';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import useAppStore from '../../store/useAppStore';
import { APP_CONFIG } from '../../utils/constants';
import communityRatings from '../../services/communityRatings';
import useNotifications from '../../hooks/useNotifications';
import { NOTIFICATION_LANGUAGES } from '../../utils/notificationMessages';

const SettingsSection = ({ className = '', menuData }) => {
  const { theme, toggleTheme } = useTheme();
  const {
    compactMode,
    toggleCompactMode,
    selectedMess,
    setSelectedMess,
    favorites,
    notificationLanguage,
    setNotificationLanguage
  } = useAppStore();
  const { permission, requestPermission } = useNotifications();

  const [isExporting, setIsExporting] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [communityStats, setCommunityStats] = useState({ totalItems: 0, totalRatings: 0, averageRating: 0 });

  // Load community rating stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await communityRatings.getStats();
        setCommunityStats(stats);
      } catch (error) {
        console.error('Error loading community stats:', error);
      }
    };

    loadStats();
  }, []);

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
        },
        {
          id: 'notifications',
          label: 'Notifications',
          description: 'Get notified when meals start',
          type: 'toggle',
          value: permission === 'granted',
          onChange: requestPermission,
          icons: { on: Bell, off: Bell },
          labels: { on: 'On', off: 'Off' }
        },
        {
          id: 'language',
          label: 'Notification Style',
          description: 'Choose your notification language style',
          type: 'select',
          value: notificationLanguage,
          onChange: setNotificationLanguage,
          options: NOTIFICATION_LANGUAGES
        }
      ]
    },
    {
      title: 'Data & Storage',
      icon: Database,
      items: [
        {
          id: 'favorites-count',
          label: 'Favorites',
          description: `You have ${favorites?.length || 0} favorite items`,
          type: 'info',
          value: favorites?.length || 0
        },
        {
          id: 'community-ratings',
          label: 'Community Ratings',
          description: `${communityStats.totalItems} items rated by community`,
          type: 'info',
          value: communityStats.totalItems
        }
      ]
    }
  ];

  const renderToggleItem = (item) => (
    <div className="flex items-center justify-between group">
      <div className="flex-1">
        <h4 className="font-medium text-text-primary group-hover:text-nebula-primary transition-colors">
          {item.label}
        </h4>
        <p className="text-sm text-text-secondary">
          {item.description}
        </p>
      </div>

      <button
        onClick={item.onChange}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border
          ${item.value
            ? 'bg-nebula-primary text-white border-nebula-primary shadow-lg shadow-nebula-primary/25'
            : 'bg-surface-200 dark:bg-white/5 text-text-secondary border-transparent hover:bg-surface-300 dark:hover:bg-white/10'
          }
        `}
      >
        {item.value ? (
          <>
            <item.icons.on size={16} />
            <span className="text-sm font-bold">{item.labels.on}</span>
          </>
        ) : (
          <>
            <item.icons.off size={16} />
            <span className="text-sm font-medium">{item.labels.off}</span>
          </>
        )}
      </button>
    </div>
  );

  const renderSelectItem = (item) => (
    <div className="flex items-center justify-between group">
      <div className="flex-1">
        <h4 className="font-medium text-text-primary group-hover:text-nebula-primary transition-colors">
          {item.label}
        </h4>
        <p className="text-sm text-text-secondary">
          {item.description}
        </p>
      </div>

      <div className="relative">
        <select
          value={item.value}
          onChange={(e) => item.onChange(e.target.value)}
          className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-surface-200 dark:bg-white/5 border border-white/10 text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-nebula-primary/50 transition-all cursor-pointer hover:bg-surface-300 dark:hover:bg-white/10"
        >
          {item.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none rotate-90" />
      </div>
    </div>
  );

  const renderInfoItem = (item) => (
    <div className="flex items-center justify-between group">
      <div className="flex-1">
        <h4 className="font-medium text-text-primary group-hover:text-nebula-primary transition-colors">
          {item.label}
        </h4>
        <p className="text-sm text-text-secondary">
          {item.description}
        </p>
      </div>

      <div className="px-3 py-1.5 rounded-lg bg-surface-200 dark:bg-white/5 text-text-primary text-sm font-bold border border-white/10">
        {item.value}
      </div>
    </div>
  );

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This will remove all favorites and ratings.')) {
      try {
        localStorage.clear();
        window.location.reload();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data. Please try again.');
      }
    }
  };

  const exportData = async () => {
    try {
      setIsExporting(true);
      const data = {
        favorites: favorites || [],
        selectedMess,
        compactMode,
        theme,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `messmate-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="card-glass p-6 bg-surface-100/90 dark:bg-nebula-dark/90 backdrop-blur-xl border-white/20 dark:border-white/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-nebula-primary/10 rounded-xl">
            <Settings className="w-5 h-5 text-nebula-primary" />
          </div>
          <h2 className="font-display font-bold text-xl text-text-primary">
            Settings
          </h2>
        </div>

        <div className="space-y-8">
          {settingsGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <group.icon size={18} className="text-nebula-primary" />
                <h3 className="font-display font-bold text-text-primary">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-surface-100 dark:bg-white/5 border border-white/10 hover:border-nebula-primary/30 transition-all"
                  >
                    {item.type === 'toggle' && renderToggleItem(item)}
                    {item.type === 'select' && renderSelectItem(item)}
                    {item.type === 'info' && renderInfoItem(item)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Community Food Rating */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Users size={18} className="text-yellow-500" />
              <h3 className="font-display font-bold text-text-primary">
                Community Food Rating
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-text-primary mb-1">
                    Rate Food Items
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Help the community by rating dishes!
                  </p>
                </div>

                <button
                  onClick={() => setShowRateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Star size={16} className="fill-current" />
                  Rate Food
                </button>
              </div>

              {/* Community Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-yellow-500/10">
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {communityStats.totalItems}
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                    Items Rated
                  </div>
                </div>
                <div className="text-center border-l border-r border-yellow-500/10">
                  <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {communityStats.totalRatings}
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                    Total Ratings
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {communityStats.averageRating}⭐
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                    Avg Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Database size={18} className="text-nebula-primary" />
              <h3 className="font-display font-bold text-text-primary">
                Data Management
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={exportData}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-200 dark:bg-white/5 border border-white/10 hover:bg-surface-300 dark:hover:bg-white/10 text-text-primary font-medium transition-colors"
              >
                <Download size={16} />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-200 dark:bg-white/5 border border-white/10 hover:bg-surface-300 dark:hover:bg-white/10 text-text-primary font-medium transition-colors"
              >
                <RefreshCw size={16} />
                Refresh App
              </button>

              <button
                onClick={clearAllData}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-nebula-error/10 border border-nebula-error/20 hover:bg-nebula-error/20 text-nebula-error font-medium transition-colors col-span-full sm:col-span-1"
              >
                <Trash2 size={16} />
                Clear All Data
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-nebula-primary/10 to-nebula-secondary/10 border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nebula-primary via-nebula-secondary to-nebula-accent" />

            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Info className="w-4 h-4 text-text-primary" />
              </div>
              <h4 className="font-display font-bold text-lg text-text-primary">
                {APP_CONFIG?.name || 'MessMate'} <span className="text-sm font-medium opacity-60">v{APP_CONFIG?.version || '1.0.0'}</span>
              </h4>
            </div>

            <p className="text-sm text-text-secondary mb-4">
              {APP_CONFIG?.description || 'Your digital mess companion'}
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-text-secondary mb-6">
              Made with <span className="text-nebula-error animate-pulse">❤️</span> for SRM students
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3">
                Developed By
              </p>
              <h4 className="font-display font-bold text-lg text-text-primary mb-1">
                Gowthamrdyy
              </h4>
              <p className="text-sm text-text-secondary mb-4">
                AIML Developer & Designer
              </p>

              <a
                href="https://linkedin.com/in/gowthamrdyy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0077b5] to-[#00a0dc] hover:from-[#006097] hover:to-[#008cc9] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
              >
                <Users size={16} />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Food Modal */}
      <RateFoodModal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        menuData={menuData}
        selectedMess={selectedMess}
        currentDate={new Date()}
        currentMeal="Lunch"
      />
    </div>
  );
};

export default SettingsSection;