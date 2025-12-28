const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Subject options mapping by art style (fallback)
const SUBJECT_MAPPINGS = {
  'abstract_geometric': [
    { value: 'organic_shapes', label: 'Organic Shapes' },
    { value: 'geometric_patterns', label: 'Geometric Patterns' },
    { value: 'fluid_forms', label: 'Fluid Forms' },
  ],
  'minimalist': [
    { value: 'lines', label: 'Lines' },
    { value: 'shapes', label: 'Shapes' },
    { value: 'negative_space', label: 'Negative Space' },
    { value: 'simple_forms', label: 'Simple Forms' },
  ],
  'botanical': [
    { value: 'flowers', label: 'Flowers' },
    { value: 'leaves', label: 'Leaves' },
    { value: 'trees', label: 'Trees' },
    { value: 'abstract_plants', label: 'Abstract Plants' },
  ],
  'landscape': [
    { value: 'mountains', label: 'Mountains' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'forest', label: 'Forest' },
    { value: 'desert', label: 'Desert' },
  ],
  'surreal': [
    { value: 'dreamscapes', label: 'Dreamscapes' },
    { value: 'abstract_forms', label: 'Abstract Forms' },
    { value: 'unexpected_combinations', label: 'Unexpected Combinations' },
  ],
  'retro_vintage': [
    { value: 'travel_poster', label: 'Travel Poster' },
    { value: 'mid_century_modern', label: 'Mid-Century Modern' },
    { value: 'psychedelic', label: 'Psychedelic' },
  ],
  'cosmic_space': [
    { value: 'planets', label: 'Planets' },
    { value: 'nebulas', label: 'Nebulas' },
    { value: 'stars', label: 'Stars' },
    { value: 'galaxies', label: 'Galaxies' },
  ],
};

// Get all questionnaire options with visual assets
router.get('/options', async (req, res) => {
  try {
    const { data: options, error } = await supabase
      .from('questionnaire_options')
      .select('*')
      .order('type', { ascending: true });

    if (error) throw error;

    // Group options by type, including visual assets
    const groupedOptions = options.reduce((acc, option) => {
      if (!acc[option.type]) {
        acc[option.type] = [];
      }
      
      // Include visual assets if available
      const optionData = {
        value: option.value,
        ...(option.image_url && { image_url: option.image_url }),
        ...(option.color_swatch && { color_swatch: option.color_swatch })
      };
      
      acc[option.type].push(optionData);
      return acc;
    }, {});

    res.json(groupedOptions);
  } catch (error) {
    console.error('Error fetching questionnaire options:', error);
    res.status(500).json({ error: 'Failed to fetch questionnaire options' });
  }
});

// Get dynamic subject options based on selected art style
router.get('/subjects/:artStyle', async (req, res) => {
  try {
    const { artStyle } = req.params;
    
    const fallbackOptions = SUBJECT_MAPPINGS[artStyle] || [];
    const subjectValues = fallbackOptions.map(opt => opt.value);
    
    // Fetch subject options from database if they exist
    const { data: options, error } = await supabase
      .from('questionnaire_options')
      .select('*')
      .eq('type', 'subject')
      .in('value', subjectValues);

    if (error) {
      console.warn('Database query failed, using fallback options:', error);
      // Return fallback options if database query fails
      return res.json(fallbackOptions);
    }

    // If database has options, use them (with visual assets if available)
    if (options && options.length > 0) {
      const formattedOptions = options.map(option => {
        const fallbackOption = fallbackOptions.find(f => f.value === option.value);
        return {
          value: option.value,
          label: fallbackOption?.label || option.value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          ...(option.image_url && { image_url: option.image_url }),
          ...(option.color_swatch && { color_swatch: option.color_swatch })
        };
      });
      return res.json(formattedOptions);
    }

    // If database is empty, return fallback options
    res.json(fallbackOptions);
  } catch (error) {
    console.error('Error fetching subject options:', error);
    // Return fallback options even on error
    const fallbackOptions = SUBJECT_MAPPINGS[req.params.artStyle] || [];
    res.json(fallbackOptions);
  }
});

module.exports = router; 