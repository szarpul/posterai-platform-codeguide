import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InteractivePosterBuilder from '../components/questionnaire/InteractivePosterBuilder';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Generated Result Component (same as QuestionnairePage)
function GeneratedResult({ generatedImage, onStartOver, onRegenerate, onSave, onCheckout, loading }) {
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

export default function VibeExplorerPage() {
  const {
    generatedImage,
    loading,
    error,
    generateImage,
    setGeneratedImage,
    resetQuestionnaire,
    responses,
  } = useQuestionnaire();
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const handleGenerate = async (selection) => {
    // InteractivePosterBuilder sends data in correct format (artStyle, colorPalette, subject)
    await generateImage(selection);
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
    <div className="min-h-screen bg-cream">
      <AnimatePresence mode="wait">
        {!generatedImage ? (
          <InteractivePosterBuilder key="builder" onGenerate={handleGenerate} loading={loading} />
        ) : (
          <div key="result" className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <GeneratedResult
                generatedImage={generatedImage}
                onStartOver={handleStartOver}
                onRegenerate={handleRegenerate}
                onSave={handleSaveAsDraft}
                onCheckout={() => navigate('/customize')}
                loading={loading}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && !generatedImage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-2xl shadow-large max-w-md"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
