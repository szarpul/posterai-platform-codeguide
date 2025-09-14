import React, { useState, useRef } from 'react';
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
    field: 'theme',
    title: 'Choose a theme',
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
    field: 'palette',
    title: 'Pick a color palette',
    description: 'What colors should dominate your design?',
    icon: '🎨',
    options: [
      { value: 'bright', label: 'Bright', description: 'Ivory, soft yellow, sky blue', icon: '☀️' },
      { value: 'dark', label: 'Dark', description: 'Charcoal, deep navy, burgundy', icon: '🌙' },
      { value: 'pastel', label: 'Pastel', description: 'Blush pink, mint, lavender', icon: '🌸' },
      { value: 'neutral', label: 'Neutral', description: 'Warm grey, sand, off-white', icon: '🪨' }
    ]
  },
  {
    field: 'style',
    title: 'Choose your style',
    description: 'Select the overall aesthetic for your poster',
    icon: '🎨',
    options: [
      { value: 'realistic', label: 'Realistic', description: 'Photorealistic with fine texture', icon: '📷' },
      { value: 'cartoon', label: 'Cartoon', description: 'Clean cartoon with bold shapes', icon: '✏️' },
      { value: 'surreal', label: 'Surreal', description: 'Dreamlike and unexpected', icon: '🌙' },
      { value: 'minimalist', label: 'Minimalist', description: 'Simple and uncluttered', icon: '⚪' },
      { value: 'flat_vector', label: 'Flat Vector', description: 'Geometric forms and solid fills', icon: '🔷' },
      { value: 'vintage_retro', label: 'Vintage/Retro', description: 'Retro vibe with film grain', icon: '📺' }
    ]
  },
  {
    field: 'mainElement',
    title: 'Main element type',
    description: 'What should be the primary visual focus?',
    icon: '🎯',
    options: [
      { value: 'photo_realistic', label: 'Photo/Realistic', description: 'Photorealistic image focus', icon: '📸' },
      { value: 'illustration_drawing', label: 'Illustration/Drawing', description: 'Artistic drawing style', icon: '✏️' },
      { value: 'abstract_shapes', label: 'Abstract Shapes', description: 'Geometric patterns and forms', icon: '🔶' }
    ]
  },
  {
    field: 'occasion',
    title: 'Where will it be used?',
    description: 'What\'s the purpose of this poster?',
    icon: '🏠',
    options: [
      { value: 'home_decoration', label: 'Home Decoration', description: 'Stylish interior design', icon: '🏡' },
      { value: 'office_workspace', label: 'Office/Workspace', description: 'Professional environment', icon: '💼' },
      { value: 'kids_room', label: 'Kids Room', description: 'Playful and child-friendly', icon: '🧸' },
      { value: 'gift_special_event', label: 'Gift/Special Event', description: 'Thoughtful personal gift', icon: '🎁' }
    ]
  },
  {
    field: 'emotion',
    title: 'Set the emotion',
    description: 'How should your poster make people feel?',
    icon: '💭',
    options: [
      { value: 'calm', label: 'Calm', description: 'Peaceful and serene', icon: '😌' },
      { value: 'energetic', label: 'Energetic', description: 'Dynamic and vibrant', icon: '⚡' },
      { value: 'nostalgic', label: 'Nostalgic', description: 'Warm and sentimental', icon: '🕰️' },
      { value: 'inspirational', label: 'Inspirational', description: 'Uplifting and awe-inspiring', icon: '✨' }
    ]
  },
  {
    field: 'inspirationKeyword',
    title: 'Inspiration keyword',
    description: 'Add a word or phrase that inspires you (optional)',
    icon: '💡',
    isTextInput: true,
    placeholder: 'e.g., freedom, ocean waves, mountain peaks...'
  }
];

function QuestionnaireStep({ step, value, selected, onChange, disabled, isLastStep, onContinue, inputRef }) {
  if (step.isTextInput) {
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

        <div className="max-w-md mx-auto space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={step.placeholder}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            disabled={disabled}
          />
          <p className="text-sm text-gray-500 text-center">
            This is optional - you can leave it blank if you prefer
          </p>
          
          {/* Continue button for the last step */}
          {isLastStep && (
            <div className="pt-4">
              <Button
                onClick={onContinue}
                disabled={disabled}
                size="lg"
                className="w-full"
              >
                Generate Poster
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

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
  const inputRef = useRef(null);

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

  const handleTextInputChange = async (value) => {
    updateResponse(currentStepData.field, value);
    
    // Don't auto-proceed for text input - let user click continue
  };

  const handleContinue = async () => {
    if (isLastStep) {
      if (!user) {
        sessionStorage.setItem('questionnaire_responses', JSON.stringify(responses));
        navigate('/login', { state: { returnTo: '/questionnaire' } });
        return;
      }
      
      // Get the current input value directly from the DOM to ensure we have the latest
      let currentInputValue = '';
      if (currentStepData.isTextInput && inputRef.current) {
        currentInputValue = inputRef.current.value;
      }
      
      // Ensure we have the most up-to-date responses before generating
      const currentResponses = {
        ...responses,
        [currentStepData.field]: currentInputValue
      };
      
      console.log('Generating image with responses:', currentResponses);
      await generateImage(currentResponses);
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
                    onChange={currentStepData.isTextInput ? handleTextInputChange : handleOptionSelect}
                    disabled={isLastStep && loading}
                    isLastStep={isLastStep}
                    onContinue={handleContinue}
                    inputRef={inputRef}
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