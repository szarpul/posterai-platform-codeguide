import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const QUESTIONNAIRE_STEPS = [
  {
    field: 'style',
    title: 'Choose your style',
    description: 'Select the overall aesthetic for your poster',
    icon: '🎨',
    options: [
      { value: 'modern', label: 'Modern', description: 'Clean lines and contemporary design', icon: '✨' },
      { value: 'vintage', label: 'Vintage', description: 'Retro and nostalgic feel', icon: '📷' },
      { value: 'abstract', label: 'Abstract', description: 'Non-representational and artistic', icon: '🎭' },
      { value: 'minimalist', label: 'Minimalist', description: 'Simple and uncluttered', icon: '⚪' }
    ]
  },
  {
    field: 'theme',
    title: 'Select a theme',
    description: 'What should your poster be about?',
    icon: '🌍',
    options: [
      { value: 'nature', label: 'Nature', description: 'Landscapes, flora, and fauna', icon: '🌿' },
      { value: 'urban', label: 'Urban', description: 'City life and architecture', icon: '🏙️' },
      { value: 'fantasy', label: 'Fantasy', description: 'Magical and otherworldly', icon: '🧙‍♂️' },
      { value: 'futuristic', label: 'Futuristic', description: 'Sci-fi and technology', icon: '🚀' }
    ]
  },
  {
    field: 'mood',
    title: 'Set the mood',
    description: 'How should your poster make people feel?',
    icon: '💭',
    options: [
      { value: 'calm', label: 'Calm', description: 'Peaceful and serene', icon: '😌' },
      { value: 'energetic', label: 'Energetic', description: 'Dynamic and vibrant', icon: '⚡' },
      { value: 'mysterious', label: 'Mysterious', description: 'Intriguing and enigmatic', icon: '🔮' },
      { value: 'joyful', label: 'Joyful', description: 'Happy and uplifting', icon: '😊' }
    ]
  },
  {
    field: 'colorPalette',
    title: 'Pick a color palette',
    description: 'What colors should dominate your design?',
    icon: '🎨',
    options: [
      { value: 'warm', label: 'Warm', description: 'Reds, oranges, and yellows', icon: '🔥' },
      { value: 'cool', label: 'Cool', description: 'Blues, greens, and purples', icon: '❄️' },
      { value: 'monochrome', label: 'Monochrome', description: 'Black, white, and grays', icon: '⚫' },
      { value: 'vibrant', label: 'Vibrant', description: 'Bold and colorful mix', icon: '🌈' }
    ]
  },
  {
    field: 'subject',
    title: 'Choose your subject',
    description: 'What should be the main focus?',
    icon: '🎯',
    options: [
      { value: 'landscapes', label: 'Landscapes', description: 'Natural or urban scenes', icon: '🏔️' },
      { value: 'portraits', label: 'Portraits', description: 'People and characters', icon: '👤' },
      { value: 'animals', label: 'Animals', description: 'Wildlife and creatures', icon: '🦁' },
      { value: 'architecture', label: 'Architecture', description: 'Buildings and structures', icon: '��️' }
    ]
  }
];

function QuestionnaireStep({ step, value, selected, onChange, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{step.icon}</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{step.title}</h2>
        <p className="text-lg text-gray-600">{step.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {step.options.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`transition-all duration-300 p-6 border-2 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              value === option.value 
                ? 'border-primary-500 bg-primary-50 ring-primary-500' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${
              selected === option.value ? 'scale-105 shadow-lg' : ''
            }`}
            disabled={disabled || (!!selected && selected !== option.value)}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-2xl">{option.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{option.label}</h3>
                <p className="mt-1 text-gray-600">{option.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
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
    updateResponse,
    nextStep,
    prevStep,
    generateImage,
    setGeneratedImage,
    resetQuestionnaire
  } = useQuestionnaire();
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const [selected, setSelected] = useState(null);
  const [stepKey, setStepKey] = useState(currentStep);

  const currentStepData = QUESTIONNAIRE_STEPS[currentStep];
  const isLastStep = currentStep === QUESTIONNAIRE_STEPS.length - 1;
  const canProceed = responses[currentStepData.field] !== '';

  const handleOptionSelect = async (value) => {
    setSelected(value);
    updateResponse(currentStepData.field, value);
    
    setTimeout(async () => {
      setSelected(null);
      if (isLastStep) {
        if (!user) {
          sessionStorage.setItem('questionnaire_responses', JSON.stringify({ ...responses, [currentStepData.field]: value }));
          navigate('/login', { state: { returnTo: '/questionnaire' } });
          return;
        }
        await generateImage({ ...responses, [currentStepData.field]: value });
      } else {
        nextStep();
        setStepKey(currentStep + 1);
      }
    }, 400);
  };

  const handleSaveAsDraft = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DRAFTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          responses,
          imageUrl: generatedImage,
          prompt: responses,
          options: responses
        })
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!generatedImage ? (
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="ghost"
                size="sm"
              >
                ← Back
              </Button>
              <span className="text-sm text-gray-500 font-medium">
                Step {currentStep + 1} of {QUESTIONNAIRE_STEPS.length}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / QUESTIONNAIRE_STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <Card className="p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stepKey}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
              >
                {isLastStep && loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner size="lg" text="Generating your poster..." />
                  </div>
                ) : (
                  <QuestionnaireStep
                    step={currentStepData}
                    value={responses[currentStepData.field]}
                    selected={selected}
                    onChange={handleOptionSelect}
                    disabled={isLastStep && loading}
                  />
                )}
              </motion.div>
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
            <p className="text-gray-600">Here's your AI-generated poster based on your choices</p>
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
            <Button
              onClick={handleSaveAsDraft}
              size="lg"
            >
              Save as Draft
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
} 