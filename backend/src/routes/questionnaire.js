const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Get all questionnaire options
router.get('/options', async (req, res) => {
  try {
    const { data: options, error } = await supabase
      .from('questionnaire_options')
      .select('*')
      .order('type', { ascending: true });

    if (error) throw error;

    // Group options by type
    const groupedOptions = options.reduce((acc, option) => {
      if (!acc[option.type]) {
        acc[option.type] = [];
      }
      acc[option.type].push(option.value);
      return acc;
    }, {});

    res.json(groupedOptions);
  } catch (error) {
    console.error('Error fetching questionnaire options:', error);
    res.status(500).json({ error: 'Failed to fetch questionnaire options' });
  }
});

module.exports = router; 