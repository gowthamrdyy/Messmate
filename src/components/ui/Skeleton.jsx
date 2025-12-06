import { motion } from 'framer-motion';

const Skeleton = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  animate = true
}) => {
  const baseClasses = 'bg-surface-200 dark:bg-white/10';

  const variants = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-lg h-4',
    card: 'rounded-2xl',
  };

  const pulseAnimation = {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${variants[variant]} ${className}`}
        style={style}
        animate={pulseAnimation}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className} animate-pulse`}
      style={style}
    />
  );
};

// Skeleton components for specific use cases
export const MealCardSkeleton = () => (
  <div className="w-full max-w-md mx-auto p-6 space-y-6 card-glass">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="40%" height="1.5rem" />
      <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
    </div>

    <Skeleton variant="text" width="60%" height="1rem" />

    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" width="70%" height="1rem" />
            <Skeleton variant="text" width="40%" height="0.8rem" />
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-between pt-4 gap-4">
      <Skeleton variant="rectangular" width="100%" height="3rem" className="rounded-xl" />
      <Skeleton variant="rectangular" width="100%" height="3rem" className="rounded-xl" />
    </div>
  </div>
);

export const HeaderSkeleton = () => (
  <div className="w-full max-w-md mx-auto px-6 py-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton variant="text" width="8rem" height="1.5rem" />
        <Skeleton variant="text" width="12rem" height="1rem" />
      </div>
      <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
    </div>
  </div>
);

export const NavigationSkeleton = () => (
  <div className="w-full max-w-md mx-auto px-4 py-2">
    <div className="flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
          <Skeleton variant="text" width="3rem" height="0.5rem" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;