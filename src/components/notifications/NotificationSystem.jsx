import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../hooks/useTheme';

const NotificationSystem = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 80, // Below the header
      }}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: theme === 'dark' 
            ? 'rgba(0, 0, 0, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: theme === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          color: theme === 'dark' ? '#f9fafb' : '#1f2937',
          boxShadow: theme === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          maxWidth: '400px',
        },
        // Success toasts
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
          style: {
            border: theme === 'dark'
              ? '1px solid rgba(16, 185, 129, 0.3)'
              : '1px solid rgba(16, 185, 129, 0.2)',
          },
        },
        // Error toasts
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
          style: {
            border: theme === 'dark'
              ? '1px solid rgba(239, 68, 68, 0.3)'
              : '1px solid rgba(239, 68, 68, 0.2)',
          },
        },
        // Loading toasts
        loading: {
          iconTheme: {
            primary: '#3B82F6',
            secondary: '#FFFFFF',
          },
          style: {
            border: theme === 'dark'
              ? '1px solid rgba(59, 130, 246, 0.3)'
              : '1px solid rgba(59, 130, 246, 0.2)',
          },
        },
      }}
    />
  );
};

export default NotificationSystem;