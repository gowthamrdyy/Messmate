import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Smartphone, Monitor, Palette, Info, Download, Trash2, RefreshCw, Database, Users, Star } from 'lucide-react';
import RateFoodModal from '../ui/RateFoodModal';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import useAppStore from '../../store/useAppStore';
import { APP_CONFIG } from '../../utils/constants';
import communityRatings from '../../services/communityRatings';

const SettingsSection = ({ className = '', menuData }) => {
  const { theme, toggleTheme } = useTheme();
  const { 
    compactMode,
    toggleCompactMode,
    selectedMess,
    setSelectedMess,
    favorites
  } = useAppStore();

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
            <item.icons.on size={16} />
            {item.labels.on}
          </>
        ) : (
          <>
            <item.icons.off size={16} />
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

  const renderInfoItem = (item) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {item.label}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {item.description}
        </p>
      </div>
      
      <div className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium">
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
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {settingsGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <group.icon size={18} className="text-gray-500 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {group.title}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <Users size={18} className="text-yellow-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Community Food Rating
                </h3>
              </div>
              
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Rate Food Items
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Help the community by rating dishes - everyone sees the same ratings!
                    </p>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowRateModal(true)}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Star size={16} />
                    Rate Food
                  </Button>
                </div>
                
                {/* Community Stats */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                      {communityStats.totalItems}
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      Items Rated
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                      {communityStats.totalRatings}
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      Total Ratings
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                      {communityStats.averageRating}⭐
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      Avg Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <Database size={18} className="text-gray-500 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Data Management
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportData}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Refresh App
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllData}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 col-span-full sm:col-span-1"
                >
                  <Trash2 size={16} />
                  Clear All Data
                </Button>
              </div>
            </div>

            {/* App Info */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    {APP_CONFIG?.name || 'MessMate'} v{APP_CONFIG?.version || '1.0.0'}
                  </h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {APP_CONFIG?.description || 'Your digital mess companion'}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Made with ❤️ for SRM students
                </p>
              </div>
            </div>

            {/* Developer Info */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">
                  Made by Gowthamrdyy
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  AIML Developer & Designer
                </p>
                <a
                  href="https://linkedin.com/in/gowthamrdyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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