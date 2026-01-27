import React from 'react';
import { motion } from 'framer-motion';

// Art style data
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

// Color palettes
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
  lines: 'Lines',
  shapes: 'Shapes',
  negative_space: 'Negative Space',
  simple_forms: 'Simple Forms',
  flowers: 'Flowers',
  leaves: 'Leaves',
  trees: 'Trees',
  abstract_plants: 'Abstract Plants',
  mountains: 'Mountains',
  ocean: 'Ocean',
  forest: 'Forest',
  desert: 'Desert',
  organic_shapes: 'Organic Shapes',
  geometric_patterns: 'Geometric Patterns',
  fluid_forms: 'Fluid Forms',
  dreamscapes: 'Dreamscapes',
  abstract_forms: 'Abstract Forms',
  unexpected_combinations: 'Unexpected Combinations',
  travel_poster: 'Travel Poster',
  mid_century_modern: 'Mid-Century Modern',
  psychedelic: 'Psychedelic',
  planets: 'Planets',
  nebulas: 'Nebulas',
  stars: 'Stars',
  galaxies: 'Galaxies',
};

export default function InteractivePosterCanvas({
  style,
  palette,
  subject,
  onStyleClick,
  onPaletteClick,
  onSubjectClick,
  hoveredZone,
  setHoveredZone,
}) {
  const styleData = ART_STYLES[style] || ART_STYLES.minimalist;
  const paletteData = COLOR_PALETTES[palette] || COLOR_PALETTES.monochrome;
  const subjectLabel = SUBJECT_LABELS[subject] || subject;

  return (
    <div className="relative">
      {/* Poster Container */}
      <motion.div
        className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Background Zone - Click to change style */}
        <motion.button
          onClick={onStyleClick}
          onMouseEnter={() => setHoveredZone('style')}
          onMouseLeave={() => setHoveredZone(null)}
          className="absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Style gradient background */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${styleData.gradient}`}
            key={style}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Color palette overlay */}
            <motion.div
              className="absolute inset-0"
              key={palette}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              {paletteData.colors.map((color, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${45 + i * 30}deg, ${color} 0%, transparent 70%)`,
                  }}
                />
              ))}
            </motion.div>

            {/* Style icon watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.span
                className="text-white/10 font-light select-none"
                style={{ fontSize: '20rem' }}
                key={style}
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                {styleData.icon}
              </motion.span>
            </div>

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* Hover hint for style */}
          {hoveredZone === 'style' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-large pointer-events-none z-20"
            >
              <span className="text-sm font-medium text-charcoal">Click to change style</span>
            </motion.div>
          )}
        </motion.button>

        {/* Color Accents Zone - Click to change palette */}
        <motion.button
          onClick={onPaletteClick}
          onMouseEnter={() => setHoveredZone('palette')}
          onMouseLeave={() => setHoveredZone(null)}
          className="absolute top-4 right-4 flex gap-2 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {paletteData.colors.slice(0, 5).map((color, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 rounded-full ring-2 ring-white/50 shadow-large"
              style={{ backgroundColor: color }}
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              whileHover={{ scale: 1.2 }}
            />
          ))}

          {/* Hover hint for palette */}
          {hoveredZone === 'palette' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -bottom-12 right-0 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-large pointer-events-none whitespace-nowrap"
            >
              <span className="text-xs font-medium text-charcoal">Click to change colors</span>
            </motion.div>
          )}
        </motion.button>

        {/* Subject Zone - Click to change subject */}
        <motion.button
          onClick={onSubjectClick}
          onMouseEnter={() => setHoveredZone('subject')}
          onMouseLeave={() => setHoveredZone(null)}
          className="absolute bottom-0 left-0 right-0 p-8 z-10 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            key={subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm font-medium text-white/70 mb-2">Featured</div>
            <div className="text-4xl font-display font-bold text-white mb-2">{subjectLabel}</div>
            <div className="text-sm text-white/90">{styleData.label} Style</div>
          </motion.div>

          {/* Hover hint for subject */}
          {hoveredZone === 'subject' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full mb-4 left-8 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-large pointer-events-none"
            >
              <span className="text-sm font-medium text-charcoal">Click to change subject</span>
            </motion.div>
          )}
        </motion.button>

        {/* Edit indicators when hovering */}
        {hoveredZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 ring-4 ring-white/50 rounded-3xl pointer-events-none"
          />
        )}
      </motion.div>

      {/* Instruction hint (fades out after first interaction) */}
      <motion.div
        className="mt-4 text-center text-sm text-charcoal-light"
        initial={{ opacity: 1 }}
        animate={{ opacity: hoveredZone ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-medium">👆 Click any part of the poster to edit it</p>
      </motion.div>
    </div>
  );
}
