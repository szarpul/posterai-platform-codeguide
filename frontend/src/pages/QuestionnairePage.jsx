import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Art Style definitions with labels
const ART_STYLES = [
  { value: 'abstract_geometric', label: 'Abstract Geometric' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'botanical', label: 'Botanical' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'surreal', label: 'Surreal' },
  { value: 'retro_vintage', label: 'Retro/Vintage' },
  { value: 'cosmic_space', label: 'Cosmic/Space' },
];

// Color Palette definitions with labels
const COLOR_PALETTES = [
  { value: 'monochrome', label: 'Monochrome' },
  { value: 'earth_tones', label: 'Earth Tones' },
  { value: 'ocean_blues', label: 'Ocean Blues' },
  { value: 'warm_sunset', label: 'Warm Sunset' },
  { value: 'forest_greens', label: 'Forest Greens' },
  { value: 'vibrant_bold', label: 'Vibrant/Bold' },
  { value: 'pastels', label: 'Pastels' },
];

// Color swatch definitions (fallback if API doesn't provide)
const COLOR_SWATCHES = {
  monochrome: ['#000000', '#FFFFFF', '#808080', '#404040'],
  earth_tones: ['#8B4513', '#D2691E', '#CD853F', '#A0522D'],
  ocean_blues: ['#006994', '#00CED1', '#4682B4', '#87CEEB'],
  warm_sunset: ['#FF6347', '#FFA500', '#FFD700', '#FF8C00'],
  forest_greens: ['#228B22', '#32CD32', '#6B8E23', '#556B2F'],
  vibrant_bold: ['#FF0000', '#0000FF', '#800080', '#FF00FF'],
  pastels: ['#FFB6C1', '#E6E6FA', '#B0E0E6', '#FFE4B5'],
};

function ArtStyleStep({ selectedStyle, onSelect, options }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Art Style</h2>
        <p className="text-lg text-gray-600">Select a style that speaks to you</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ART_STYLES.map((style, index) => {
          const optionData = options?.art_style?.find((opt) => opt.value === style.value) || {};
          const imageUrl = optionData.image_url;

          return (
            <motion.button
              key={style.value}
              onClick={() => onSelect(style.value)}
              className={`relative group transition-all duration-300 rounded-xl overflow-hidden border-2 ${
                selectedStyle === style.value
                  ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Image or placeholder */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {imageUrl ? (
                  <img src={imageUrl} alt={style.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎨</div>
                      <div className="text-sm">{style.label}</div>
                    </div>
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />

                {/* Selected indicator */}
                {selectedStyle === style.value && (
                  <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold text-sm">{style.label}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function ColorPaletteStep({ selectedPalette, onSelect, options }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Color Palette</h2>
        <p className="text-lg text-gray-600">Select colors that match your style</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLOR_PALETTES.map((palette, index) => {
          const optionData =
            options?.color_palette?.find((opt) => opt.value === palette.value) || {};
          const colorSwatch = optionData.color_swatch || COLOR_SWATCHES[palette.value] || [];

          return (
            <motion.button
              key={palette.value}
              onClick={() => onSelect(palette.value)}
              className={`transition-all duration-300 p-6 border-2 rounded-xl text-left ${
                selectedPalette === palette.value
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                {/* Color swatch */}
                <div className="flex flex-wrap gap-1 flex-shrink-0">
                  {colorSwatch.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {colorSwatch.length === 0 && (
                    <div className="w-8 h-8 rounded border border-gray-300 bg-gray-200" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{palette.label}</h3>
                  {selectedPalette === palette.value && (
                    <div className="mt-2 text-primary-600 text-sm font-medium">✓ Selected</div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function SubjectStep({ selectedSubject, onSelect, subjectOptions, artStyle }) {
  // Show loading or empty state only if we don't have an art style selected
  if (!artStyle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select an art style first</p>
      </div>
    );
  }

  // If we have art style but no options yet, show loading
  if (!subjectOptions || subjectOptions.length === 0) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner text="Loading subject options..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Subject</h2>
        <p className="text-lg text-gray-600">Select elements that match your {artStyle} style</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjectOptions.map((option, index) => {
          const label =
            option.label ||
            option.value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <motion.button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`transition-all duration-300 p-6 border-2 rounded-xl text-left ${
                selectedSubject === option.value
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="font-semibold text-gray-900 text-lg">{label}</h3>
              {selectedSubject === option.value && (
                <div className="mt-2 text-primary-600 text-sm font-medium">✓ Selected</div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function QuestionnairePage() {
  const {
    responses,
    currentStep,
    generatedImage,
    loading,
    error,
    questionnaireOptions,
    subjectOptions,
    updateResponse,
    nextStep,
    prevStep,
    generateImage,
    setGeneratedImage,
    resetQuestionnaire,
  } = useQuestionnaire();
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const [selected, setSelected] = useState(null);

  const handleStep1Select = (value) => {
    setSelected(value);
    updateResponse('artStyle', value);
    setTimeout(() => {
      setSelected(null);
      nextStep();
    }, 400);
  };

  const handleStep2Select = (value) => {
    setSelected(value);
    updateResponse('colorPalette', value);
    setTimeout(() => {
      setSelected(null);
      nextStep();
    }, 400);
  };

  const handleStep3Select = async (value) => {
    setSelected(value);
    updateResponse('subject', value);

    setTimeout(async () => {
      setSelected(null);
      if (!user) {
        sessionStorage.setItem(
          'questionnaire_responses',
          JSON.stringify({ ...responses, subject: value })
        );
        navigate('/login', { state: { returnTo: '/questionnaire' } });
        return;
      }
      await generateImage({ ...responses, subject: value });
    }, 400);
  };

  const handleSaveAsDraft = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DRAFTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          responses,
          imageUrl: generatedImage,
          prompt: responses,
          options: responses,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save draft');
      }

      const data = await response.json();
      navigate(`/poster/${data.id}`);
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const handleRegenerate = async () => {
    await generateImage(responses);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {!generatedImage ? (
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button onClick={prevStep} disabled={currentStep === 0} variant="ghost" size="sm">
                ← Back
              </Button>
              <span className="text-sm text-gray-500 font-medium">Step {currentStep + 1} of 3</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <Card className="p-8">
            <AnimatePresence mode="wait" initial={false}>
              {loading && currentStep === 2 ? (
                <div key="loading" className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner size="lg" text="Generating your poster..." />
                </div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  {currentStep === 0 && (
                    <ArtStyleStep
                      selectedStyle={responses.artStyle}
                      onSelect={handleStep1Select}
                      options={questionnaireOptions}
                    />
                  )}
                  {currentStep === 1 && (
                    <ColorPaletteStep
                      selectedPalette={responses.colorPalette}
                      onSelect={handleStep2Select}
                      options={questionnaireOptions}
                    />
                  )}
                  {currentStep === 2 && (
                    <SubjectStep
                      selectedSubject={responses.subject}
                      onSelect={handleStep3Select}
                      subjectOptions={subjectOptions}
                      artStyle={
                        responses.artStyle
                          ? ART_STYLES.find((s) => s.value === responses.artStyle)?.label ||
                            responses.artStyle
                          : ''
                      }
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Generated Poster</h2>
            <p className="text-gray-600">Here's your AI-generated art poster for home decor</p>
          </div>

          <Card className="p-6">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={generatedImage}
                alt="Generated poster"
                className="w-full h-full object-center object-cover"
              />
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                setGeneratedImage(null);
                resetQuestionnaire();
              }}
              variant="outline"
              size="lg"
            >
              Start Over
            </Button>
            <Button onClick={handleRegenerate} variant="outline" size="lg">
              Regenerate
            </Button>
            <Button onClick={handleSaveAsDraft} size="lg">
              Save as Draft
            </Button>
            <Button
              onClick={() => navigate('/customize')}
              size="lg"
              className="bg-primary-600 hover:bg-primary-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
