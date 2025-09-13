import { motion } from 'framer-motion';

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular', 
  width = '100%', 
  height = '1rem',
  animate = true 
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded';
  
  const variants = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-xl',
  };

  const pulseAnimation = {
    opacity: [0.5, 1, 0.5],
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
  <div className="w-full max-w-md mx-auto p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="40%" height="1.5rem" />
      <Skeleton variant="circular" width="2rem" height="2rem" />
    </div>
    
    <Skeleton variant="text" width="60%" height="1rem" />
    
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton variant="circular" width="2rem" height="2rem" />
          <Skeleton variant="text" width="70%" height="1rem" />
        </div>
      ))}
    </div>
    
    <div className="flex justify-between pt-4">
      <Skeleton variant="rectangular" width="30%" height="2rem" className="rounded-full" />
      <Skeleton variant="rectangular" width="30%" height="2rem" className="rounded-full" />
    </div>
  </div>
);

export const HeaderSkeleton = () => (
  <div className="w-full max-w-md mx-auto px-6 py-4 space-y-2">
    <div className="flex items-center justify-center space-x-2">
      <Skeleton variant="circular" width="2rem" height="2rem" />
      <Skeleton variant="text" width="8rem" height="1.5rem" />
    </div>
    <Skeleton variant="text" width="12rem" height="0.875rem" className="mx-auto" />
    <Skeleton variant="rectangular" width="8rem" height="2rem" className="rounded-lg mx-auto" />
  </div>
);

export const NavigationSkeleton = () => (
  <div className="w-full max-w-md mx-auto px-4 space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
      <Skeleton variant="text" width="8rem" height="1.25rem" />
      <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
    </div>
    <Skeleton variant="text" width="6rem" height="0.875rem" className="mx-auto" />
  </div>
);

export default Skeleton;