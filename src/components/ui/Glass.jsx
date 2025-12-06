import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Glass = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default',
  blur = 'md',
  border = true,
  shadow = true,
  rounded = 'lg',
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-white/80 dark:bg-black/60',
    light: 'bg-white/90 dark:bg-white/10',
    dark: 'bg-black/20 dark:bg-black/80',
    subtle: 'bg-white/60 dark:bg-black/40',
  };

  const blurLevels = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const roundedLevels = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const baseClasses = [
    variants[variant],
    blurLevels[blur],
    roundedLevels[rounded],
    'transition-all duration-200',
  ];

  if (border) {
    baseClasses.push('border border-white/20 dark:border-white/10');
  }

  if (shadow) {
    baseClasses.push('shadow-lg dark:shadow-2xl');
  }

  return (
    <div
      ref={ref}
      className={cn(baseClasses.join(' '), className)}
      {...props}
    >
      {children}
    </div>
  );
});

Glass.displayName = 'Glass';

export default Glass;