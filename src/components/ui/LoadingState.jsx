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
      <div className="w-full h-full border-2 border-surface-200 dark:border-white/10 border-t-nebula-primary rounded-full" />
    </motion.div>
  );
};

const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`flex space-x-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 bg-nebula-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
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
      className={`w-12 h-12 bg-nebula-primary/20 rounded-full flex items-center justify-center ${className}`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="w-6 h-6 bg-nebula-primary rounded-full" />
    </motion.div>
  );
};

// Full page loading state
export const PageLoadingState = ({ message = 'Loading...', showLogo = true }) => {
  return (
    <FadeIn className="min-h-screen bg-surface-100 dark:bg-nebula-dark flex flex-col items-center justify-center p-4">
      {showLogo && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
          <div className="text-6xl mb-4 filter drop-shadow-lg">🍽️</div>
          <h1 className="font-display font-bold text-3xl text-text-primary tracking-tight">
            Messmate
          </h1>
        </motion.div>
      )}

      <LoadingSpinner size="lg" className="mb-6" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-text-secondary font-medium text-center"
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
    <FadeIn className={`flex flex-col items-center justify-center p-6 ${className}`}>
      {renderLoader()}
      {message && (
        <p className="text-sm font-medium text-text-secondary mt-3 text-center">
          {message}
        </p>
      )}
    </FadeIn>
  );
};

// Skeleton loading for the main app
export const AppLoadingState = () => {
  return (
    <div className="min-h-screen bg-surface-100 dark:bg-nebula-dark flex flex-col w-full h-full fixed inset-0 overflow-hidden">
      <FadeIn delay={0.1}>
        <div className="sticky top-0 z-50 bg-surface-100/80 dark:bg-nebula-dark/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
          <HeaderSkeleton />
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-6 mb-4 px-4">
          <div className="w-full max-w-md mx-auto bg-surface-200 dark:bg-white/5 rounded-2xl p-1.5 border border-white/20 dark:border-white/10">
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-white dark:bg-white/10 rounded-xl shadow-sm animate-pulse" />
              <div className="flex-1 h-10 bg-transparent rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </FadeIn>

      <main className="flex-1 flex flex-col items-center justify-start p-4 w-full max-w-md mx-auto pb-24 overflow-y-auto">
        <FadeIn delay={0.3} className="w-full space-y-4">
          <MealCardSkeleton />
          <MealCardSkeleton />
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