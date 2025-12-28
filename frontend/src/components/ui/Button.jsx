import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      className = '',
      to,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500 shadow-medium hover:shadow-large hover:-translate-y-0.5',
      secondary:
        'bg-secondary-600 text-white hover:bg-secondary-500 focus-visible:ring-secondary-500 shadow-medium hover:shadow-large hover:-translate-y-0.5',
      accent:
        'bg-accent-300 text-charcoal hover:bg-accent-200 focus-visible:ring-accent-300 shadow-medium hover:shadow-large hover:-translate-y-0.5',
      outline:
        'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500 hover:border-primary-600 hover:text-primary-600',
      ghost: 'text-charcoal hover:bg-cream-dark focus-visible:ring-primary-500',
      danger:
        'bg-error-500 text-white hover:bg-error-600 focus-visible:ring-error-500 shadow-medium hover:shadow-large',
      white:
        'bg-white text-charcoal hover:bg-cream focus-visible:ring-white shadow-medium hover:shadow-large hover:-translate-y-0.5',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

    const LoadingSpinner = () => (
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // If 'to' prop is provided, render as Link
    if (to) {
      return (
        <Link to={to} className={classes} {...props}>
          {loading ? (
            <span className="flex items-center">
              <LoadingSpinner />
              Loading...
            </span>
          ) : (
            children
          )}
        </Link>
      );
    }

    // Otherwise render as button
    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading ? (
          <span className="flex items-center">
            <LoadingSpinner />
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
