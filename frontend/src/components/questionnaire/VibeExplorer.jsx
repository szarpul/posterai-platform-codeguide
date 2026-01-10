import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MoodConstellation from './MoodConstellation';
import LivePosterPreview from './LivePosterPreview';
import VariationButtons from './VariationButtons';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import {
  MOODS,
  getDominantMood,
  selectFromMoodInfluence,
  calculateMoodInfluence,
  getVariations,
  getRandomCombination,
} from '../../config/moodMapping';

export default function VibeExplorer({ onGenerate, loading }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Start at center of constellation
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [currentSelection, setCurrentSelection] = useState({
    style: 'minimalist',
    palette: 'monochrome',
    subject: 'simple_forms',
  });
  const [currentMood, setCurrentMood] = useState('minimal');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Update selection based on position
  useEffect(() => {
    setHasInteracted(true);
    const influences = calculateMoodInfluence(position, MOODS);
    const dominantMood = getDominantMood(position, MOODS);
    const selection = selectFromMoodInfluence(influences, MOODS);

    setCurrentMood(dominantMood);
    setCurrentSelection(selection);
  }, [position]);

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
  };

  const handleDifferentColors = () => {
    const variations = getVariations(currentSelection, MOODS, currentMood);
    if (variations.alternativePalettes.length > 0) {
      const newPalette =
        variations.alternativePalettes[
          Math.floor(Math.random() * variations.alternativePalettes.length)
        ];
      setCurrentSelection((prev) => ({ ...prev, palette: newPalette }));
    }
  };

  const handleDifferentSubject = () => {
    const variations = getVariations(currentSelection, MOODS, currentMood);
    if (variations.alternativeSubjects.length > 0) {
      const newSubject =
        variations.alternativeSubjects[
          Math.floor(Math.random() * variations.alternativeSubjects.length)
        ];
      setCurrentSelection((prev) => ({ ...prev, subject: newSubject }));
    }
  };

  const handleSurpriseMe = () => {
    const random = getRandomCombination(MOODS);
    setCurrentSelection({
      style: random.style,
      palette: random.palette,
      subject: random.subject,
    });
    setPosition(random.moodPosition);
  };

  const handleGenerate = async () => {
    if (!user) {
      sessionStorage.setItem('questionnaire_responses', JSON.stringify(currentSelection));
      navigate('/login', { state: { returnTo: '/questionnaire' } });
      return;
    }

    await onGenerate(currentSelection);
  };

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
            Discover Your Vibe
          </h1>
          <p className="text-xl text-charcoal-light max-w-2xl mx-auto">
            Explore the mood constellation to create your perfect poster
          </p>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left: Constellation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-8">
              <MoodConstellation
                position={position}
                onPositionChange={handlePositionChange}
                currentMood={currentMood}
              />

              {/* Help text */}
              <motion.div
                className="mt-6 text-center text-sm text-charcoal-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: hasInteracted ? 0.7 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="mb-2">
                  <span className="font-semibold text-charcoal">Tip:</span> Drag the selector or
                  click any mood point
                </p>
                <p className="text-xs">
                  Your poster preview updates in real-time as you explore
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Preview & Actions */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Live Preview */}
            <LivePosterPreview
              selection={currentSelection}
              moodLabel={MOODS[currentMood]?.label || 'Exploring'}
              isGenerating={loading}
            />

            {/* Variation Buttons */}
            {!loading && (
              <VariationButtons
                onDifferentColors={handleDifferentColors}
                onDifferentSubject={handleDifferentSubject}
                onSurpriseMe={handleSurpriseMe}
              />
            )}

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

              {/* Mood summary below button */}
              <motion.div
                className="mt-4 text-center text-sm text-charcoal-light"
                key={currentMood}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Currently exploring:{' '}
                <span className="font-semibold text-primary-600">
                  {MOODS[currentMood]?.description}
                </span>
              </motion.div>
            </motion.div>

            {/* Additional info */}
            <motion.div
              className="bg-primary-50 border border-primary-100 rounded-2xl p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl">💡</div>
                <div>
                  <h4 className="font-display font-semibold text-charcoal mb-2">
                    How it works
                  </h4>
                  <ul className="text-sm text-charcoal-light space-y-1">
                    <li>• Each mood combines style, colors, and subject</li>
                    <li>• Move between moods to discover new combinations</li>
                    <li>• Use variation buttons for quick tweaks</li>
                    <li>• Generate when you find your perfect vibe</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Back to traditional flow link */}
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
    </div>
  );
}
