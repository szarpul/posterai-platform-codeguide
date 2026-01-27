import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';

// Art style visual data (from QuestionnairePage)
const ART_STYLES = {
  abstract_geometric: {
    label: 'Abstract Geometric',
    gradient: 'from-rose-400 via-fuchsia-500 to-indigo-500',
    icon: '◆',
  },
  minimalist: {
    label: 'Minimalist',
    gradient: 'from-stone-300 via-stone-400 to-stone-500',
    icon: '○',
  },
  botanical: {
    label: 'Botanical',
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    icon: '❀',
  },
  landscape: {
    label: 'Landscape',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    icon: '▲',
  },
  surreal: {
    label: 'Surreal',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    icon: '◎',
  },
  retro_vintage: {
    label: 'Retro Vintage',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    icon: '✦',
  },
  cosmic_space: {
    label: 'Cosmic Space',
    gradient: 'from-indigo-500 via-purple-600 to-slate-800',
    icon: '★',
  },
};

// Color palette data
const COLOR_PALETTES = {
  monochrome: {
    label: 'Monochrome',
    colors: ['#1a1a1a', '#4a4a4a', '#8a8a8a', '#c0c0c0', '#f0f0f0'],
  },
  earth_tones: {
    label: 'Earth Tones',
    colors: ['#8B4513', '#A0522D', '#CD853F', '#D2B48C', '#F5DEB3'],
  },
  ocean_blues: {
    label: 'Ocean Blues',
    colors: ['#0c4a6e', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc'],
  },
  warm_sunset: {
    label: 'Warm Sunset',
    colors: ['#9a3412', '#ea580c', '#f97316', '#fb923c', '#fdba74'],
  },
  forest_greens: {
    label: 'Forest Greens',
    colors: ['#14532d', '#166534', '#22c55e', '#4ade80', '#86efac'],
  },
  vibrant_bold: {
    label: 'Vibrant Bold',
    colors: ['#dc2626', '#7c3aed', '#0891b2', '#16a34a', '#eab308'],
  },
  pastels: {
    label: 'Pastels',
    colors: ['#fecdd3', '#ddd6fe', '#a5f3fc', '#bbf7d0', '#fef08a'],
  },
};

// Subject labels
const SUBJECT_LABELS = {
  // Minimalist
  lines: 'Lines',
  shapes: 'Shapes',
  negative_space: 'Negative Space',
  simple_forms: 'Simple Forms',
  // Botanical
  flowers: 'Flowers',
  leaves: 'Leaves',
  trees: 'Trees',
  abstract_plants: 'Abstract Plants',
  // Landscape
  mountains: 'Mountains',
  ocean: 'Ocean',
  forest: 'Forest',
  desert: 'Desert',
  // Abstract Geometric
  organic_shapes: 'Organic Shapes',
  geometric_patterns: 'Geometric Patterns',
  fluid_forms: 'Fluid Forms',
  // Surreal
  dreamscapes: 'Dreamscapes',
  abstract_forms: 'Abstract Forms',
  unexpected_combinations: 'Unexpected Combinations',
  // Retro
  travel_poster: 'Travel Poster',
  mid_century_modern: 'Mid-Century Modern',
  psychedelic: 'Psychedelic',
  // Cosmic
  planets: 'Planets',
  nebulas: 'Nebulas',
  stars: 'Stars',
  galaxies: 'Galaxies',
};

export default function LivePosterPreview({ selection, moodLabel, isGenerating = false }) {
  const { style, palette, subject } = selection;
  const styleData = ART_STYLES[style] || ART_STYLES.minimalist;
  const paletteData = COLOR_PALETTES[palette] || COLOR_PALETTES.monochrome;
  const subjectLabel = SUBJECT_LABELS[subject] || subject;

  return (
    <div className="space-y-6">
      {/* Mood Badge */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        key={moodLabel}
      >
        <span className="pill text-sm">
          <span className="mr-2">✨</span>
          {moodLabel}
        </span>
      </motion.div>

      {/* Poster Preview */}
      <Card padding={false} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${style}-${palette}-${subject}`}
            className="relative aspect-[3/4] overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            {/* Style gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${styleData.gradient}`}>
              {/* Color palette overlay */}
              <div className="absolute inset-0 opacity-40">
                {paletteData.colors.map((color, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${45 + i * 30}deg, ${color} 0%, transparent 70%)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  />
                ))}
              </div>

              {/* Style icon watermark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-white/10 font-light select-none"
                  style={{ fontSize: '20rem' }}
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                >
                  {styleData.icon}
                </motion.span>
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Subject text representation */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-sm font-medium text-white/60 mb-2">Featured</div>
                  <div className="text-3xl font-display font-bold mb-2">{subjectLabel}</div>
                  <div className="text-sm text-white/80">{styleData.label} Style</div>
                </motion.div>
              </div>

              {/* Color dots indicator */}
              <div className="absolute top-4 right-4 flex gap-2">
                {paletteData.colors.slice(0, 5).map((color, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full ring-1 ring-white/30"
                    style={{ backgroundColor: color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05, type: 'spring' }}
                  />
                ))}
              </div>
            </div>

            {/* Generating overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full border-4 border-white/20 mx-auto" />
                      <motion.div
                        className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-white mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                    <div className="text-white font-medium">Generating...</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Selection Summary */}
        <div className="p-6 bg-cream-dark">
          <div className="flex flex-wrap gap-2 justify-center">
            <SelectionChip label="Style" value={styleData.label} />
            <SelectionChip label="Palette" value={paletteData.label} />
            <SelectionChip label="Subject" value={subjectLabel} />
          </div>
        </div>
      </Card>

      {/* Quick info */}
      <motion.div
        className="text-center text-sm text-charcoal-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>This is a preview of your poster style</p>
        <p className="text-xs mt-1">The final result will be uniquely generated</p>
      </motion.div>
    </div>
  );
}

function SelectionChip({ label, value }) {
  return (
    <motion.div
      className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-soft"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span className="text-xs font-medium text-charcoal-light mr-2">{label}:</span>
      <span className="text-sm font-semibold text-charcoal">{value}</span>
    </motion.div>
  );
}
