import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  text,
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  const colors = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    accent: 'border-accent-500',
    white: 'border-white'
  };
  
  const spinnerClasses = `animate-spin rounded-full border-2 border-gray-200 ${colors[variant]} ${sizes[size]}`;
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={spinnerClasses}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner; 