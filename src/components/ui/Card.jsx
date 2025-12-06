import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Card = forwardRef(({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  ...props
}, ref) => {
  const paddingLevels = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const variants = {
    default: 'card-glass',
    flat: 'bg-surface-100 dark:bg-white/5 border border-white/20 dark:border-white/10',
    outlined: 'bg-transparent border border-white/20 dark:border-white/10',
    ghost: 'bg-transparent border-none shadow-none',
  };

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-soft cursor-pointer transition-all duration-300' : '';

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl overflow-hidden',
        variants[variant],
        paddingLevels[padding],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card sub-components
const CardHeader = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ children, className = '', ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-display font-bold text-lg leading-none tracking-tight text-text-primary', className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ children, className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('', className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Export all components
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;