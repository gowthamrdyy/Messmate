import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import useAppStore from '../../store/useAppStore';

const PWAInstallPrompt = () => {
  const { installPrompt, isInstalled, installPWA, setInstallPrompt } = useAppStore();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setInstallPrompt(null);
    };

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowPrompt(false);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [setInstallPrompt]);

  const handleInstall = () => {
    installPWA();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-20 left-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Download size={20} className="text-blue-600 dark:text-blue-400" style={{ display: 'inline-block' }} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base md:text-lg text-gray-900 dark:text-white">
                  Install Messmate
                </h3>
                <p className="text-caption text-gray-500 dark:text-gray-400">
                  Get quick access to your mess menu
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} style={{ display: 'inline-block' }} />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
