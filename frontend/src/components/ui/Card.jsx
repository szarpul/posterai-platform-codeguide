import React from 'react';
import { motion } from 'framer-motion';

const Card = React.forwardRef(({
  children,
  variant = 'default',
  hover = true,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden';
  
  const variants = {
    default: '',
    elevated: 'shadow-medium hover:shadow-large',
    outline: 'border-2 border-gray-200 shadow-none',
    interactive: 'cursor-pointer transition-all duration-200 hover:shadow-medium hover:-translate-y-1',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${hover ? 'hover:shadow-medium' : ''} ${className}`;
  
  const MotionComponent = hover ? motion.div : 'div';
  
  return (
    <MotionComponent
      ref={ref}
      className={classes}
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
});

Card.displayName = 'Card';

export default Card; 