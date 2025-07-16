import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONNAIRE_STEPS = [
  {
    field: 'style',
    title: 'Choose your style',
    description: 'Select the overall aesthetic for your poster',
    options: [
      { value: 'modern', label: 'Modern', description: 'Clean lines and contemporary design' },
      { value: 'vintage', label: 'Vintage', description: 'Retro and nostalgic feel' },
      { value: 'abstract', label: 'Abstract', description: 'Non-representational and artistic' },
      { value: 'minimalist', label: 'Minimalist', description: 'Simple and uncluttered' }
    ]
  },
  {
    field: 'theme',
    title: 'Select a theme',
    description: 'What should your poster be about?',
    options: [
      { value: 'nature', label: 'Nature', description: 'Landscapes, flora, and fauna' },
      { value: 'urban', label: 'Urban', description: 'City life and architecture' },
      { value: 'fantasy', label: 'Fantasy', description: 'Magical and otherworldly' },
      { value: 'futuristic', label: 'Futuristic', description: 'Sci-fi and technology' }
    ]
  },
  {
    field: 'mood',
    title: 'Set the mood',
    description: 'How should your poster make people feel?',
    options: [
      { value: 'calm', label: 'Calm', description: 'Peaceful and serene' },
      { value: 'energetic', label: 'Energetic', description: 'Dynamic and vibrant' },
      { value: 'mysterious', label: 'Mysterious', description: 'Intriguing and enigmatic' },
      { value: 'joyful', label: 'Joyful', description: 'Happy and uplifting' }
    ]
  },
  {
    field: 'colorPalette',
    title: 'Pick a color palette',
    description: 'What colors should dominate your design?',
    options: [
      { value: 'warm', label: 'Warm', description: 'Reds, oranges, and yellows' },
      { value: 'cool', label: 'Cool', description: 'Blues, greens, and purples' },
      { value: 'monochrome', label: 'Monochrome', description: 'Black, white, and grays' },
      { value: 'vibrant', label: 'Vibrant', description: 'Bold and colorful mix' }
    ]
  },
  {
    field: 'subject',
    title: 'Choose your subject',
    description: 'What should be the main focus?',
    options: [
      { value: 'landscapes', label: 'Landscapes', description: 'Natural or urban scenes' },
      { value: 'portraits', label: 'Portraits', description: 'People and characters' },
      { value: 'animals', label: 'Animals', description: 'Wildlife and creatures' },
      { value: 'architecture', label: 'Architecture', description: 'Buildings and structures' }
    ]
  }
];

function QuestionnaireStep({ step, value, selected, onChange, disabled }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{step.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {step.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`transition-all duration-300 p-4 border rounded-lg text-left focus:outline-none
              ${value === option.value ? 'ring-2 ring-indigo-500' : 'hover:border-gray-300'}
              ${selected === option.value ? 'bg-indigo-100 scale-105 shadow-lg' : ''}
            `}
            disabled={disabled || (!!selected && selected !== option.value)}
          >
            <h3 className="font-medium text-gray-900">{option.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
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

  const [selected, setSelected] = useState(null); // for highlight
  const [stepKey, setStepKey] = useState(currentStep); // for AnimatePresence

  const currentStepData = QUESTIONNAIRE_STEPS[currentStep];
  const isLastStep = currentStep === QUESTIONNAIRE_STEPS.length - 1;
  const canProceed = responses[currentStepData.field] !== '';

  const handleOptionSelect = async (value) => {
    setSelected(value);
    updateResponse(currentStepData.field, value);
    // Wait 400ms to show highlight, then advance
    setTimeout(async () => {
      setSelected(null);
      if (isLastStep) {
        if (!user) {
          sessionStorage.setItem('questionnaire_responses', JSON.stringify({ ...responses, [currentStepData.field]: value }));
          navigate('/login', { state: { returnTo: '/questionnaire' } });
          return;
        }
        // Pass the up-to-date responses to generateImage
        await generateImage({ ...responses, [currentStepData.field]: value });
      } else {
        nextStep();
        setStepKey(currentStep + 1); // update key for AnimatePresence
      }
    }, 400);
  };

  const handleNext = async () => {
    if (isLastStep) {
      if (!user) {
        // Save current responses to session storage before redirecting
        sessionStorage.setItem('questionnaire_responses', JSON.stringify(responses));
        navigate('/login', { state: { returnTo: '/questionnaire' } });
        return;
      }
      await generateImage();
    } else {
      nextStep();
    }
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      {!generatedImage ? (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                Back
              </button>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {QUESTIONNAIRE_STEPS.length}
              </span>
            </div>

            <div className="mt-4 min-h-[260px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stepKey}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* If on last step and loading, show spinner instead of options */}
                  {isLastStep && loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                      <div className="text-lg text-gray-700 font-medium">Generating your poster...</div>
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
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-8">
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={generatedImage}
              alt="Generated poster"
              className="w-full h-full object-center object-cover"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setGeneratedImage(null);
                resetQuestionnaire();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Over
            </button>
            <button
              onClick={handleSaveAsDraft}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save as Draft
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 