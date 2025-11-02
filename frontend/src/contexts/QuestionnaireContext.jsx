import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../config/api';

const QuestionnaireContext = createContext({});

export function useQuestionnaire() {
  return useContext(QuestionnaireContext);
}

export function QuestionnaireProvider({ children }) {
  const { user, session } = useAuth();
  const [responses, setResponses] = useState({
    theme: '',
    palette: '',
    style: '',
    emotion: '',
    inspirationKeyword: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateResponse = (field, value) => {
    setResponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4)); // 5 steps total (0-4)
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const resetQuestionnaire = () => {
    setResponses({
      theme: '',
      palette: '',
      style: '',
      emotion: '',
      inspirationKeyword: '',
    });
    setCurrentStep(0);
    setGeneratedImage(null);
    setError('');
  };

  const generateImage = async (overrideResponses) => {
    try {
      if (!user || !session?.access_token) {
        setError('Please log in to generate images');
        return;
      }

      setLoading(true);
      setError('');
      const payload = overrideResponses || responses;
      const response = await fetch(API_ENDPOINTS.GENERATE_IMAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(err.message || 'Failed to generate image. Please try again.');
      console.error('Image generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    responses,
    currentStep,
    generatedImage,
    loading,
    error,
    updateResponse,
    nextStep,
    prevStep,
    resetQuestionnaire,
    generateImage,
    setGeneratedImage,
  };

  return <QuestionnaireContext.Provider value={value}>{children}</QuestionnaireContext.Provider>;
}
