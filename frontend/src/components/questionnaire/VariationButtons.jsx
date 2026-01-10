import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function VariationButtons({ onDifferentColors, onDifferentSubject, onSurpriseMe }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-display font-semibold text-charcoal mb-2">
          Not quite right?
        </h3>
        <p className="text-sm text-charcoal-light">Try these quick variations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <VariationButton
          icon="🎨"
          label="Different Colors"
          description="Try another palette"
          onClick={onDifferentColors}
          delay={0}
        />
        <VariationButton
          icon="✨"
          label="Different Subject"
          description="Change the focus"
          onClick={onDifferentSubject}
          delay={0.1}
        />
        <VariationButton
          icon="🎲"
          label="Surprise Me"
          description="Random combo"
          onClick={onSurpriseMe}
          delay={0.2}
        />
      </div>
    </div>
  );
}

function VariationButton({ icon, label, description, onClick, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Button
        onClick={onClick}
        variant="outline"
        className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 group hover:bg-primary-50 hover:border-primary-300 transition-all duration-300"
      >
        <motion.span
          className="text-3xl"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.span>
        <div className="text-center">
          <div className="font-semibold text-sm text-charcoal group-hover:text-primary-700 transition-colors">
            {label}
          </div>
          <div className="text-xs text-charcoal-light group-hover:text-primary-600 transition-colors">
            {description}
          </div>
        </div>
      </Button>
    </motion.div>
  );
}
