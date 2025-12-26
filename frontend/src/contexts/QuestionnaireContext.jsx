import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../config/api';

// Helper function for default subject options (fallback)
function getDefaultSubjectOptions(artStyle) {
  const mappings = {
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
  return mappings[artStyle] || [];
}

const QuestionnaireContext = createContext({});

export function useQuestionnaire() {
  return useContext(QuestionnaireContext);
}

export function QuestionnaireProvider({ children }) {
  const { user, session } = useAuth();
  // New 3-step structure: artStyle, colorPalette, subject
  const [responses, setResponses] = useState({
    artStyle: '',
    colorPalette: '',
    subject: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questionnaireOptions, setQuestionnaireOptions] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);

  // Load questionnaire options on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.QUESTIONNAIRE_OPTIONS);
        if (!response.ok) throw new Error('Failed to load options');
        const data = await response.json();
        setQuestionnaireOptions(data);
      } catch (err) {
        console.error('Error loading questionnaire options:', err);
      }
    };
    loadOptions();
  }, []);

  // Load subject options when art style changes
  useEffect(() => {
    const loadSubjectOptions = async () => {
      if (!responses.artStyle) {
        setSubjectOptions([]);
        return;
      }

      try {
        // Convert art style value to match backend expectations (e.g., abstract_geometric)
        const artStyleValue = responses.artStyle;
        const response = await fetch(
          `${API_ENDPOINTS.QUESTIONNAIRE_BASE}/subjects/${artStyleValue}`
        );

        if (!response.ok) {
          throw new Error('Failed to load subject options');
        }

        const data = await response.json();

        // If API returns empty array or no data, use fallback
        if (!data || data.length === 0) {
          console.log('API returned empty subject options, using fallback');
          setSubjectOptions(getDefaultSubjectOptions(responses.artStyle));
          return;
        }

        // Transform API response to include labels
        const formattedOptions = data.map((opt) => ({
          value: opt.value,
          label: opt.value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          ...(opt.image_url && { image_url: opt.image_url }),
          ...(opt.color_swatch && { color_swatch: opt.color_swatch }),
        }));
        setSubjectOptions(formattedOptions);
      } catch (err) {
        console.error('Error loading subject options, using fallback:', err);
        // Always use fallback if API fails or returns empty
        const fallbackOptions = getDefaultSubjectOptions(responses.artStyle);
        setSubjectOptions(fallbackOptions);
      }
    };
    loadSubjectOptions();
  }, [responses.artStyle]);

  const updateResponse = (field, value) => {
    setResponses((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset subject when art style changes
      if (field === 'artStyle' && prev.artStyle !== value) {
        updated.subject = '';
      }
      return updated;
    });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2)); // 3 steps total (0-2)
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const resetQuestionnaire = () => {
    setResponses({
      artStyle: '',
      colorPalette: '',
      subject: '',
    });
    setCurrentStep(0);
    setGeneratedImage(null);
    setError('');
    setSubjectOptions([]);
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

      // Use new 3-step format
      const requestPayload = {
        artStyle: payload.artStyle,
        colorPalette: payload.colorPalette,
        subject: payload.subject,
      };

      const response = await fetch(API_ENDPOINTS.GENERATE_IMAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestPayload),
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
    questionnaireOptions,
    subjectOptions,
    updateResponse,
    nextStep,
    prevStep,
    resetQuestionnaire,
    generateImage,
    setGeneratedImage,
  };

  return <QuestionnaireContext.Provider value={value}>{children}</QuestionnaireContext.Provider>;
}
