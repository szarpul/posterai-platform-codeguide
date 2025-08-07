import React from 'react';
import { motion } from 'framer-motion';

const Input = React.forwardRef(({
  label,
  error,
  success,
  helperText,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  const stateClasses = error 
    ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
    : success 
    ? 'border-success-300 focus:border-success-500 focus:ring-success-500'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  
  const classes = `${baseClasses} ${stateClasses} ${className}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <motion.input
        ref={ref}
        className={classes}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.1 }}
        {...props}
      />
      {(error || success || helperText) && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm ${
            error ? 'text-error-600' : 
            success ? 'text-success-600' : 
            'text-gray-500'
          }`}
        >
          {error || success || helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 