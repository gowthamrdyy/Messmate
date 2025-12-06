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
        className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-8 md:w-96"
      >
        <div className="card-glass p-4 border-nebula-primary/20 bg-surface-100/90 dark:bg-nebula-dark/90 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-nebula-primary/10 rounded-xl flex items-center justify-center">
                <Download size={24} className="text-nebula-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-text-primary">
                  Install Messmate
                </h3>
                <p className="text-sm text-text-secondary">
                  Get quick access to your mess menu
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-white/10 transition-colors text-text-tertiary"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-nebula-primary hover:bg-nebula-primary/90 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-nebula-primary/20"
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-surface-200 dark:bg-white/5 hover:bg-surface-300 dark:hover:bg-white/10 text-text-primary text-sm font-bold py-2.5 px-4 rounded-xl transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
