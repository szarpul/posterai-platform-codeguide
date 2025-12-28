import React from 'react';
import { motion } from 'framer-motion';

const Card = React.forwardRef(
  (
    { children, variant = 'default', hover = true, padding = true, className = '', ...props },
    ref
  ) => {
    const baseClasses = 'bg-warm-white rounded-2xl overflow-hidden';

    const variants = {
      default: 'shadow-medium border border-charcoal/5',
      elevated: 'shadow-large',
      outline: 'border-2 border-charcoal/10 shadow-none',
      flat: 'bg-cream shadow-none',
      glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-medium',
    };

    const paddingClass = padding ? 'p-6' : '';

    const classes = `${baseClasses} ${variants[variant]} ${paddingClass} ${className}`;

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={`${classes} transition-all duration-300`}
          whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(45, 42, 38, 0.12)' }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
