import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Art styles
const ART_STYLES = [
  {
    value: 'abstract_geometric',
    label: 'Abstract Geometric',
    description: 'Bold shapes and mathematical precision',
    gradient: 'from-rose-400 via-fuchsia-500 to-indigo-500',
    icon: '◆',
  },
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Clean lines, essential forms',
    gradient: 'from-stone-300 via-stone-400 to-stone-500',
    icon: '○',
  },
  {
    value: 'botanical',
    label: 'Botanical',
    description: "Nature's intricate beauty",
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    icon: '❀',
  },
  {
    value: 'landscape',
    label: 'Landscape',
    description: 'Horizons that inspire',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    icon: '▲',
  },
  {
    value: 'surreal',
    label: 'Surreal',
    description: 'Dreams made visible',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    icon: '◎',
  },
  {
    value: 'retro_vintage',
    label: 'Retro Vintage',
    description: 'Nostalgic charm',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    icon: '✦',
  },
  {
    value: 'cosmic_space',
    label: 'Cosmic Space',
    description: 'The infinite beyond',
    gradient: 'from-indigo-500 via-purple-600 to-slate-800',
    icon: '★',
  },
];

// Color palettes
const COLOR_PALETTES = [
  {
    value: 'monochrome',
    label: 'Monochrome',
    description: 'Timeless elegance',
    colors: ['#1a1a1a', '#4a4a4a', '#8a8a8a', '#c0c0c0', '#f0f0f0'],
  },
  {
    value: 'earth_tones',
    label: 'Earth Tones',
    description: 'Warm and grounded',
    colors: ['#8B4513', '#A0522D', '#CD853F', '#D2B48C', '#F5DEB3'],
  },
  {
    value: 'ocean_blues',
    label: 'Ocean Blues',
    description: 'Deep and tranquil',
    colors: ['#0c4a6e', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc'],
  },
  {
    value: 'warm_sunset',
    label: 'Warm Sunset',
    description: 'Golden hour magic',
    colors: ['#9a3412', '#ea580c', '#f97316', '#fb923c', '#fdba74'],
  },
  {
    value: 'forest_greens',
    label: 'Forest Greens',
    description: 'Natural serenity',
    colors: ['#14532d', '#166534', '#22c55e', '#4ade80', '#86efac'],
  },
  {
    value: 'vibrant_bold',
    label: 'Vibrant Bold',
    description: 'Electric energy',
    colors: ['#dc2626', '#7c3aed', '#0891b2', '#16a34a', '#eab308'],
  },
  {
    value: 'pastels',
    label: 'Pastels',
    description: 'Soft and dreamy',
    colors: ['#fecdd3', '#ddd6fe', '#a5f3fc', '#bbf7d0', '#fef08a'],
  },
];

// Base overlay component
function PickerOverlay({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Overlay content */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl z-50 max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-charcoal/10 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-2xl font-display font-bold text-charcoal">{title}</h3>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-cream-dark hover:bg-charcoal/10 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <svg className="w-6 h-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Style Picker
export function StylePickerOverlay({ isOpen, onClose, currentStyle, onSelect, onPreview }) {
  const handleHover = (style) => {
    if (onPreview) {
      onPreview(style);
    }
  };

  const handleSelect = (value) => {
    onSelect(value);
    onClose();
  };

  return (
    <PickerOverlay isOpen={isOpen} onClose={onClose} title="Choose Your Style">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ART_STYLES.map((style, index) => (
          <motion.button
            key={style.value}
            onClick={() => handleSelect(style.value)}
            onMouseEnter={() => handleHover(style.value)}
            className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                currentStyle === style.value
                  ? 'ring-4 ring-primary-500'
                  : 'ring-2 ring-charcoal/10 hover:ring-primary-300'
              }`}
            >
              {/* Style preview */}
              <div className={`aspect-[4/3] bg-gradient-to-br ${style.gradient} relative`}>
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/30 text-6xl font-light">{style.icon}</span>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-semibold mb-1">{style.label}</h4>
                  <p className="text-white/70 text-xs">{style.description}</p>
                </div>

                {/* Selected indicator */}
                {currentStyle === style.value && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-large"
                  >
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-charcoal-light">
        <p>Hover to preview • Click to select</p>
      </div>
    </PickerOverlay>
  );
}

// Palette Picker
export function PalettePickerOverlay({ isOpen, onClose, currentPalette, onSelect, onPreview }) {
  const handleHover = (palette) => {
    if (onPreview) {
      onPreview(palette);
    }
  };

  const handleSelect = (value) => {
    onSelect(value);
    onClose();
  };

  return (
    <PickerOverlay isOpen={isOpen} onClose={onClose} title="Select Your Palette">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COLOR_PALETTES.map((palette, index) => (
          <motion.button
            key={palette.value}
            onClick={() => handleSelect(palette.value)}
            onMouseEnter={() => handleHover(palette.value)}
            className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`overflow-hidden rounded-2xl transition-all duration-300 bg-white ${
                currentPalette === palette.value
                  ? 'ring-4 ring-primary-500'
                  : 'ring-2 ring-charcoal/10 hover:ring-primary-300'
              }`}
            >
              {/* Color strip */}
              <div className="h-24 flex">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 transition-all duration-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">{palette.label}</h4>
                    <p className="text-sm text-charcoal-light">{palette.description}</p>
                  </div>

                  {/* Selected indicator */}
                  {currentPalette === palette.value && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {/* Color dots */}
                <div className="flex gap-2">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full ring-1 ring-charcoal/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-charcoal-light">
        <p>Hover to preview • Click to select</p>
      </div>
    </PickerOverlay>
  );
}

// Subject Picker
export function SubjectPickerOverlay({ isOpen, onClose, currentSubject, subjects, onSelect }) {
  const handleSelect = (value) => {
    onSelect(value);
    onClose();
  };

  return (
    <PickerOverlay isOpen={isOpen} onClose={onClose} title="Pick Your Subject">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {subjects.map((subject, index) => {
          const label = subject.label || subject.value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <motion.button
              key={subject.value}
              onClick={() => handleSelect(subject.value)}
              className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  currentSubject === subject.value
                    ? 'bg-primary-500 text-white ring-4 ring-primary-200'
                    : 'bg-cream-dark hover:bg-primary-50 text-charcoal'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>

                {currentSubject === subject.value && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </PickerOverlay>
  );
}

