import { forwardRef } from 'react';
import Glass from './Glass';
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

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer' : '';

  return (
    <Glass
      ref={ref}
      variant={variant}
      className={cn(
        paddingLevels[padding],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </Glass>
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
    className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white', className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ children, className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
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