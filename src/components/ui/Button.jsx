import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  ariaControls,
  ariaHaspopup,
  ...props
}, ref) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'bg-nebula-error hover:bg-nebula-error/90 text-white shadow-lg shadow-nebula-error/20',
    success: 'bg-nebula-success hover:bg-nebula-success/90 text-white shadow-lg shadow-nebula-success/20',
    glass: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
    icon: 'p-2.5',
  };

  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'font-bold rounded-xl',
    'transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-nebula-primary/50 focus:ring-offset-2 focus:ring-offset-transparent',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
    'active:scale-[0.98]',
  ];

  // Apply variant classes if not disabled/loading, or apply disabled styles
  if (!disabled && !loading) {
    baseClasses.push(variants[variant] || variants.primary);
  } else {
    // Keep the shape but gray out
    baseClasses.push('bg-surface-200 dark:bg-white/10 text-text-tertiary cursor-not-allowed border border-transparent');
  }

  baseClasses.push(sizes[size]);

  return (
    <button
      ref={ref}
      className={cn(baseClasses.join(' '), className)}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      aria-controls={ariaControls}
      aria-haspopup={ariaHaspopup}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin w-4 h-4" />
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;