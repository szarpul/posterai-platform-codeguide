import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InteractivePosterCanvas from './InteractivePosterCanvas';
import { StylePickerOverlay, PalettePickerOverlay, SubjectPickerOverlay } from './PickerOverlays';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

// Default subjects (will be replaced by dynamic subjects from context)
const DEFAULT_SUBJECTS = [
  { value: 'simple_forms', label: 'Simple Forms' },
  { value: 'geometric_patterns', label: 'Geometric Patterns' },
  { value: 'lines', label: 'Lines' },
  { value: 'shapes', label: 'Shapes' },
];

// Subject mapping by style
const STYLE_SUBJECTS = {
  abstract_geometric: [
    { value: 'organic_shapes', label: 'Organic Shapes' },
    { value: 'geometric_patterns', label: 'Geometric Patterns' },
    { value: 'fluid_forms', label: 'Fluid Forms' },
  ],
  minimalist: [
    { value: 'lines', label: 'Lines' },
    { value: 'shapes', label: 'Shapes' },
    { value: 'negative_space', label: 'Negative Space' },
    { value: 'simple_forms', label: 'Simple Forms' },
  ],
  botanical: [
    { value: 'flowers', label: 'Flowers' },
    { value: 'leaves', label: 'Leaves' },
    { value: 'trees', label: 'Trees' },
    { value: 'abstract_plants', label: 'Abstract Plants' },
  ],
  landscape: [
    { value: 'mountains', label: 'Mountains' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'forest', label: 'Forest' },
    { value: 'desert', label: 'Desert' },
  ],
  surreal: [
    { value: 'dreamscapes', label: 'Dreamscapes' },
    { value: 'abstract_forms', label: 'Abstract Forms' },
    { value: 'unexpected_combinations', label: 'Unexpected Combinations' },
  ],
  retro_vintage: [
    { value: 'travel_poster', label: 'Travel Poster' },
    { value: 'mid_century_modern', label: 'Mid-Century Modern' },
    { value: 'psychedelic', label: 'Psychedelic' },
  ],
  cosmic_space: [
    { value: 'planets', label: 'Planets' },
    { value: 'nebulas', label: 'Nebulas' },
    { value: 'stars', label: 'Stars' },
    { value: 'galaxies', label: 'Galaxies' },
  ],
};

export default function InteractivePosterBuilder({ onGenerate, loading }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Current selection state
  const [currentSelection, setCurrentSelection] = useState({
    style: 'minimalist',
    palette: 'monochrome',
    subject: 'simple_forms',
  });

  // Preview state (for hover previews)
  const [previewSelection, setPreviewSelection] = useState(null);

  // Which picker is open
  const [activePicker, setActivePicker] = useState(null);

  // Hovered zone on poster
  const [hoveredZone, setHoveredZone] = useState(null);

  // Has user interacted
  const [hasInteracted, setHasInteracted] = useState(false);

  // Available subjects based on current style
  const [availableSubjects, setAvailableSubjects] = useState(DEFAULT_SUBJECTS);

  // Update available subjects when style changes
  useEffect(() => {
    const subjects = STYLE_SUBJECTS[currentSelection.style] || DEFAULT_SUBJECTS;
    setAvailableSubjects(subjects);

    // If current subject is not available in new style, pick the first one
    if (!subjects.find((s) => s.value === currentSelection.subject)) {
      setCurrentSelection((prev) => ({
        ...prev,
        subject: subjects[0].value,
      }));
    }
  }, [currentSelection.style]);

  // Open pickers
  const openStylePicker = () => {
    setActivePicker('style');
    setHasInteracted(true);
  };

  const openPalettePicker = () => {
    setActivePicker('palette');
    setHasInteracted(true);
  };

  const openSubjectPicker = () => {
    setActivePicker('subject');
    setHasInteracted(true);
  };

  // Close pickers
  const closePicker = () => {
    setActivePicker(null);
    setPreviewSelection(null);
  };

  // Handle selections
  const handleStyleSelect = (style) => {
    setCurrentSelection((prev) => ({ ...prev, style }));
    setPreviewSelection(null);
  };

  const handlePaletteSelect = (palette) => {
    setCurrentSelection((prev) => ({ ...prev, palette }));
    setPreviewSelection(null);
  };

  const handleSubjectSelect = (subject) => {
    setCurrentSelection((prev) => ({ ...prev, subject }));
  };

  // Handle previews (hover)
  const handleStylePreview = (style) => {
    setPreviewSelection({ ...currentSelection, style });
  };

  const handlePalettePreview = (palette) => {
    setPreviewSelection({ ...currentSelection, palette });
  };

  // Generate poster
  const handleGenerate = async () => {
    if (!user) {
      sessionStorage.setItem(
        'questionnaire_responses',
        JSON.stringify({
          artStyle: currentSelection.style,
          colorPalette: currentSelection.palette,
          subject: currentSelection.subject,
        })
      );
      navigate('/login', { state: { returnTo: '/vibe-explorer' } });
      return;
    }

    await onGenerate({
      artStyle: currentSelection.style,
      colorPalette: currentSelection.palette,
      subject: currentSelection.subject,
    });
  };

  // What to display (current or preview)
  const displaySelection = previewSelection || currentSelection;

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-charcoal mb-4">
            Build Your Poster
          </h1>
          <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
            Click any part of the poster to customize it
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Interactive Poster */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InteractivePosterCanvas
              style={displaySelection.style}
              palette={displaySelection.palette}
              subject={displaySelection.subject}
              onStyleClick={openStylePicker}
              onPaletteClick={openPalettePicker}
              onSubjectClick={openSubjectPicker}
              hoveredZone={hoveredZone}
              setHoveredZone={setHoveredZone}
            />
          </motion.div>

          {/* Right: Info & Actions */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Current Selection Info */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-display font-semibold text-charcoal mb-4">
                Your Poster Design
              </h3>

              <div className="space-y-3">
                <SelectionRow
                  icon="🎨"
                  label="Style"
                  value={currentSelection.style.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  onClick={openStylePicker}
                />
                <SelectionRow
                  icon="🌈"
                  label="Colors"
                  value={currentSelection.palette.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  onClick={openPalettePicker}
                />
                <SelectionRow
                  icon="✨"
                  label="Subject"
                  value={currentSelection.subject.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  onClick={openSubjectPicker}
                />
              </div>
            </div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleGenerate}
                loading={loading}
                size="lg"
                className="w-full py-6 text-lg font-semibold shadow-large hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  'Creating Your Poster...'
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate My Poster
                  </>
                )}
              </Button>
            </motion.div>

            {/* How it Works */}
            <motion.div
              className="bg-primary-50 border border-primary-100 rounded-2xl p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl">💡</div>
                <div>
                  <h4 className="font-display font-semibold text-charcoal mb-2">How it works</h4>
                  <ul className="text-sm text-charcoal-light space-y-1">
                    <li>• Click the poster background to change the style</li>
                    <li>• Click the color dots to pick a new palette</li>
                    <li>• Click the subject text to change what's featured</li>
                    <li>• See your changes update instantly</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Back to classic link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => navigate('/questionnaire')}
            className="text-sm text-charcoal-light hover:text-primary-600 transition-colors underline"
          >
            Prefer the classic step-by-step? Click here
          </button>
        </motion.div>
      </div>

      {/* Picker Overlays */}
      <StylePickerOverlay
        isOpen={activePicker === 'style'}
        onClose={closePicker}
        currentStyle={currentSelection.style}
        onSelect={handleStyleSelect}
        onPreview={handleStylePreview}
      />

      <PalettePickerOverlay
        isOpen={activePicker === 'palette'}
        onClose={closePicker}
        currentPalette={currentSelection.palette}
        onSelect={handlePaletteSelect}
        onPreview={handlePalettePreview}
      />

      <SubjectPickerOverlay
        isOpen={activePicker === 'subject'}
        onClose={closePicker}
        currentSubject={currentSelection.subject}
        subjects={availableSubjects}
        onSelect={handleSubjectSelect}
      />
    </div>
  );
}

// Selection row component
function SelectionRow({ icon, label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-xl bg-cream-dark hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-left">
          <div className="text-xs text-charcoal-light">{label}</div>
          <div className="font-semibold text-charcoal group-hover:text-primary-700">{value}</div>
        </div>
      </div>
      <svg
        className="w-5 h-5 text-charcoal-light group-hover:text-primary-600 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
