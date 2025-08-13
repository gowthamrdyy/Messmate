import { motion } from 'framer-motion';
import { HeaderSkeleton, MealCardSkeleton } from './Skeleton';
import { FadeIn } from './PageTransition';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <motion.div
      className={`${sizes[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-full h-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full" />
    </motion.div>
  );
};

const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

const LoadingPulse = ({ className = '' }) => {
  return (
    <motion.div
      className={`w-12 h-12 bg-blue-500 dark:bg-blue-400 rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Full page loading state
export const PageLoadingState = ({ message = 'Loading...', showLogo = true }) => {
  return (
    <FadeIn className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      {showLogo && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
            Messmate
          </h1>
        </motion.div>
      )}
      
      <LoadingSpinner size="lg" className="mb-4" />
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400 text-center"
      >
        {message}
      </motion.p>
    </FadeIn>
  );
};

// Component loading state
export const ComponentLoadingState = ({ 
  variant = 'spinner', 
  size = 'md', 
  message,
  className = '' 
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <LoadingDots />;
      case 'pulse':
        return <LoadingPulse />;
      case 'spinner':
      default:
        return <LoadingSpinner size={size} />;
    }
  };

  return (
    <FadeIn className={`flex flex-col items-center justify-center p-4 ${className}`}>
      {renderLoader()}
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
          {message}
        </p>
      )}
    </FadeIn>
  );
};

// Skeleton loading for the main app
export const AppLoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col w-full h-full fixed inset-0">
      <FadeIn delay={0.1}>
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <HeaderSkeleton />
        </div>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <div className="mt-4 mb-4 px-4">
          <div className="w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <div className="flex space-x-1">
              <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </FadeIn>
      
      <main className="flex-1 flex flex-col items-center justify-start p-4 w-full max-w-md mx-auto pb-20">
        <FadeIn delay={0.3}>
          <div className="w-full">
            <MealCardSkeleton />
          </div>
        </FadeIn>
      </main>
    </div>
  );
};

// Inline loading for buttons and small components
export const InlineLoading = ({ size = 'sm', className = '' }) => {
  return <LoadingSpinner size={size} className={className} />;
};

export { LoadingSpinner, LoadingDots, LoadingPulse };
export default ComponentLoadingState;