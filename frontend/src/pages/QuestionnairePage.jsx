import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Art Style definitions with visual metadata
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

// Color Palette definitions
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

// Progress Steps Component
function ProgressSteps({ currentStep }) {
  const steps = ['Style', 'Palette', 'Subject'];

  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                index < currentStep
                  ? 'bg-primary-500 text-white'
                  : index === currentStep
                  ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                  : 'bg-cream-dark text-warm-gray'
              }`}
              animate={{
                scale: index === currentStep ? 1.1 : 1,
              }}
            >
              {index < currentStep ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </motion.div>
            <span
              className={`mt-2 text-xs font-medium ${
                index <= currentStep ? 'text-primary-600' : 'text-warm-gray'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-1 mx-3 rounded-full transition-colors duration-300 ${
                index < currentStep ? 'bg-primary-500' : 'bg-cream-dark'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Art Style Card
function StyleCard({ style, isSelected, onClick, index, imageUrl }) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
          isSelected
            ? 'ring-4 ring-primary-500 ring-offset-2 ring-offset-cream'
            : 'ring-1 ring-charcoal/10 hover:ring-2 hover:ring-primary-300'
        }`}
      >
        {/* Gradient Background */}
        <div className={`aspect-[4/3] bg-gradient-to-br ${style.gradient} relative`}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={style.label}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />
          )}

          {/* Decorative Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 text-8xl font-light select-none">{style.icon}</span>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-display font-semibold text-white mb-1">{style.label}</h3>
            <p className="text-white/70 text-sm">{style.description}</p>
          </div>

          {/* Selection Indicator */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-large"
              >
                <svg
                  className="w-5 h-5 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}

// Color Palette Card
function PaletteCard({ palette, isSelected, onClick, index, apiColors }) {
  const colors = apiColors || palette.colors;

  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        hover={false}
        padding={false}
        className={`overflow-hidden transition-all duration-300 ${
          isSelected
            ? 'ring-4 ring-primary-500 ring-offset-2 ring-offset-cream'
            : 'ring-1 ring-charcoal/10 hover:ring-2 hover:ring-primary-300'
        }`}
      >
        {/* Color Strip */}
        <div className="h-24 flex">
          {colors.map((color, i) => (
            <motion.div
              key={i}
              className="flex-1"
              style={{ backgroundColor: color }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.08 + i * 0.05, duration: 0.3 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-semibold text-charcoal mb-1">{palette.label}</h3>
              <p className="text-charcoal-light text-sm">{palette.description}</p>
            </div>
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Color Dots */}
          <div className="flex gap-2 mt-4">
            {colors.map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full ring-1 ring-charcoal/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.button>
  );
}

// Subject Card
function SubjectCard({ option, isSelected, onClick, index }) {
  const label =
    option.label || option.value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        hover={false}
        className={`text-center transition-all duration-300 ${
          isSelected
            ? 'ring-4 ring-primary-500 ring-offset-2 ring-offset-cream bg-primary-50'
            : 'ring-1 ring-charcoal/10 hover:ring-2 hover:ring-primary-300'
        }`}
      >
        <h3
          className={`font-display font-medium transition-colors ${
            isSelected ? 'text-primary-700' : 'text-charcoal group-hover:text-primary-600'
          }`}
        >
          {label}
        </h3>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-2 text-primary-600 text-sm font-medium flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Selected
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.button>
  );
}

// Step Components
function ArtStyleStep({ selectedStyle, onSelect, options }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-semibold text-charcoal mb-4">
          Choose Your Style
        </h2>
        <p className="text-lg text-charcoal-light max-w-2xl mx-auto">
          Select an artistic direction that resonates with your vision
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ART_STYLES.map((style, index) => {
          const optionData = options?.art_style?.find((opt) => opt.value === style.value) || {};
          return (
            <StyleCard
              key={style.value}
              style={style}
              isSelected={selectedStyle === style.value}
              onClick={() => onSelect(style.value)}
              index={index}
              imageUrl={optionData.image_url}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function ColorPaletteStep({ selectedPalette, onSelect, options }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-semibold text-charcoal mb-4">
          Select Your Palette
        </h2>
        <p className="text-lg text-charcoal-light max-w-2xl mx-auto">
          Colors set the mood and emotion of your artwork
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLOR_PALETTES.map((palette, index) => {
          const optionData =
            options?.color_palette?.find((opt) => opt.value === palette.value) || {};
          return (
            <PaletteCard
              key={palette.value}
              palette={palette}
              isSelected={selectedPalette === palette.value}
              onClick={() => onSelect(palette.value)}
              index={index}
              apiColors={optionData.color_swatch}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function SubjectStep({ selectedSubject, onSelect, subjectOptions, artStyle }) {
  if (!artStyle) {
    return (
      <div className="text-center py-20">
        <p className="text-charcoal-light">Please select an art style first</p>
      </div>
    );
  }

  if (!subjectOptions || subjectOptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner text="Loading subjects..." />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-semibold text-charcoal mb-4">
          Pick Your Subject
        </h2>
        <p className="text-lg text-charcoal-light max-w-2xl mx-auto">
          The focal point for your <span className="text-primary-600 font-medium">{artStyle}</span>{' '}
          artwork
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {subjectOptions.map((option, index) => (
          <SubjectCard
            key={option.value}
            option={option}
            isSelected={selectedSubject === option.value}
            onClick={() => onSelect(option.value)}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Loading State
function GeneratingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-24"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-cream-dark" />
        <motion.div
          className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-primary-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <h3 className="text-2xl font-display font-semibold text-charcoal mb-2">
        Creating Your Poster
      </h3>
      <p className="text-charcoal-light">Our AI is generating something beautiful...</p>
    </motion.div>
  );
}

// Generated Result
function GeneratedResult({
  generatedImage,
  onStartOver,
  onRegenerate,
  onSave,
  onCheckout,
  loading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="pill mb-4">
            <svg
              className="w-4 h-4 mr-2 text-secondary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Generated Successfully
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-charcoal mb-4">
            Your Poster is Ready
          </h2>
          <p className="text-charcoal-light text-lg">Here's your AI-generated artwork</p>
        </motion.div>
      </div>

      {/* Poster Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-4 md:p-6 mb-10" padding={false}>
          <div className="relative rounded-xl overflow-hidden bg-cream-dark">
            <img src={generatedImage} alt="Generated poster" className="w-full h-auto" />
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Button onClick={onStartOver} variant="ghost" size="lg">
          Start Over
        </Button>
        <Button onClick={onRegenerate} variant="outline" size="lg" loading={loading}>
          Regenerate
        </Button>
        <Button onClick={onSave} variant="secondary" size="lg">
          Save as Draft
        </Button>
        <Button onClick={onCheckout} size="lg">
          Proceed to Checkout
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Main Component
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

  const handleStyleSelect = (value) => {
    updateResponse('artStyle', value);
    setTimeout(() => nextStep(), 400);
  };

  const handlePaletteSelect = (value) => {
    updateResponse('colorPalette', value);
    setTimeout(() => nextStep(), 400);
  };

  const handleSubjectSelect = async (value) => {
    updateResponse('subject', value);

    setTimeout(async () => {
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
    } catch (err) {
      console.error('Save draft error:', err);
      alert('Failed to save draft. Please try again.');
    }
  };

  const handleRegenerate = async () => {
    await generateImage(responses);
  };

  const handleStartOver = () => {
    setGeneratedImage(null);
    resetQuestionnaire();
  };

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!generatedImage ? (
          <>
            {/* New Experience Banner */}
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl px-6 py-3 shadow-soft">
                <span className="text-2xl">✨</span>
                <div className="text-left">
                  <div className="text-sm font-semibold text-charcoal">
                    Try our new interactive experience!
                  </div>
                  <button
                    onClick={() => navigate('/vibe-explorer')}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    Switch to Vibe Explorer →
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Progress */}
            <ProgressSteps currentStep={currentStep} />

            {/* Navigation */}
            <div className="flex items-center justify-between mb-10">
              <Button onClick={prevStep} disabled={currentStep === 0} variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </Button>
              <span className="text-sm text-charcoal-light font-medium">
                Step {currentStep + 1} of 3
              </span>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {loading && currentStep === 2 ? (
                <GeneratingState key="loading" />
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && (
                    <ArtStyleStep
                      selectedStyle={responses.artStyle}
                      onSelect={handleStyleSelect}
                      options={questionnaireOptions}
                    />
                  )}
                  {currentStep === 1 && (
                    <ColorPaletteStep
                      selectedPalette={responses.colorPalette}
                      onSelect={handlePaletteSelect}
                      options={questionnaireOptions}
                    />
                  )}
                  {currentStep === 2 && (
                    <SubjectStep
                      selectedSubject={responses.subject}
                      onSelect={handleSubjectSelect}
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

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-2xl text-center"
              >
                {error}
              </motion.div>
            )}
          </>
        ) : (
          <GeneratedResult
            generatedImage={generatedImage}
            onStartOver={handleStartOver}
            onRegenerate={handleRegenerate}
            onSave={handleSaveAsDraft}
            onCheckout={() => navigate('/customize')}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
