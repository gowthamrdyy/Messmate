/**
 * Notification Configuration for Messmate
 * Contains VAPID keys and API endpoints for push notifications
 */

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// VAPID Keys Configuration
export const VAPID_CONFIG = {
  // Replace these with your actual VAPID keys
  // Generate at: https://web-push-codelab.glitch.me/
  publicKey: process.env.VITE_VAPID_PUBLIC_KEY || 'YOUR_VAPID_PUBLIC_KEY_HERE',
  privateKey: process.env.VITE_VAPID_PRIVATE_KEY || 'YOUR_VAPID_PRIVATE_KEY_HERE',
  
  // VAPID subject (your email or website URL)
  subject: process.env.VITE_VAPID_SUBJECT || 'mailto:your-email@example.com',
  
  // VAPID audience (your website URL)
  audience: process.env.VITE_VAPID_AUDIENCE || 'https://your-domain.com'
};

// API Endpoints Configuration
export const API_CONFIG = {
  // Base URL for your API
  baseUrl: process.env.VITE_API_BASE_URL || 'https://your-api-domain.com',
  
  // API endpoints
  endpoints: {
    subscribe: '/api/notifications/subscribe',
    unsubscribe: '/api/notifications/unsubscribe',
    updatePreferences: '/api/notifications/preferences',
    sendNotification: '/api/notifications/send',
    scheduleNotification: '/api/notifications/schedule',
    getPreferences: '/api/notifications/preferences'
  },
  
  // API headers
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.VITE_API_TOKEN || 'YOUR_API_TOKEN'}`
  }
};

// Notification Settings
export const NOTIFICATION_CONFIG = {
  // Default notification preferences
  defaultPreferences: {
    mealReminders: true,
    menuUpdates: true,
    specialMeals: true,
    testNotifications: false
  },
  
  // Notification timing (in minutes before meal time)
  reminderTiming: {
    breakfast: 30, // 30 minutes before breakfast
    lunch: 30,     // 30 minutes before lunch
    dinner: 30,    // 30 minutes before dinner
    snacks: 15     // 15 minutes before snacks
  },
  
  // Notification icons
  icons: {
    default: '/pwa-192x192.png',
    badge: '/Messmate.png',
    action: '/Messmate.png'
  },
  
  // Notification actions
  actions: [
    {
      action: 'view',
      title: 'View Menu',
      icon: '/Messmate.png'
    },
    {
      action: 'dismiss',
      title: 'Dismiss',
      icon: '/Messmate.png'
    }
  ]
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  // Enable Firebase Cloud Messaging
  useFirebase: process.env.VITE_USE_FIREBASE === 'true' || false,
  
  // Firebase project settings
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  
  // Firebase Functions base URL
  functionsBaseUrl: process.env.VITE_FIREBASE_FUNCTIONS_URL || 'https://your-region-your-project.cloudfunctions.net'
};

// Development vs Production settings
export const getNotificationConfig = () => {
  if (isDevelopment) {
    return {
      ...VAPID_CONFIG,
      ...API_CONFIG,
      ...NOTIFICATION_CONFIG,
      ...FIREBASE_CONFIG,
      // Use mock API for development
      useMockAPI: true,
      // Skip VAPID for local development
      skipVAPID: true,
      // Use Firebase in development if configured
      useFirebase: FIREBASE_CONFIG.useFirebase
    };
  }
  
  return {
    ...VAPID_CONFIG,
    ...API_CONFIG,
    ...NOTIFICATION_CONFIG,
    ...FIREBASE_CONFIG,
    // Use real API for production
    useMockAPI: false,
    // Use VAPID for production
    skipVAPID: false,
    // Use Firebase in production if configured
    useFirebase: FIREBASE_CONFIG.useFirebase
  };
};

// Helper function to validate VAPID configuration
export const validateVAPIDConfig = () => {
  const config = getNotificationConfig();
  
  if (!config.skipVAPID) {
    if (!config.publicKey || config.publicKey === 'YOUR_VAPID_PUBLIC_KEY_HERE') {
      console.warn('⚠️ VAPID Public Key not configured. Push notifications will not work.');
      return false;
    }
    
    if (!config.privateKey || config.privateKey === 'YOUR_VAPID_PRIVATE_KEY_HERE') {
      console.warn('⚠️ VAPID Private Key not configured. Server-side push notifications will not work.');
      return false;
    }
  }
  
  return true;
};

// Helper function to validate API configuration
export const validateAPIConfig = () => {
  const config = getNotificationConfig();
  
  if (!config.useMockAPI) {
    if (!config.baseUrl || config.baseUrl === 'https://your-api-domain.com') {
      console.warn('⚠️ API Base URL not configured. Server communication will not work.');
      return false;
    }
  }
  
  return true;
};

export default getNotificationConfig;
