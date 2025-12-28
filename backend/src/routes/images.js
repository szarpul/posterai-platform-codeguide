const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ImageGeneratorService = require('../services/imageGenerator');
const supabase = require('../lib/supabase');

// Generate image from questionnaire options
// Supports both new 3-step format (artStyle, colorPalette, subject) and old format (theme, palette, style, emotion)
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { 
      // New 3-step format
      artStyle, 
      colorPalette, 
      subject,
      // Old format (for backward compatibility)
      theme, 
      palette, 
      style, 
      emotion, 
      inspirationKeyword 
    } = req.body;
    
    // Validate: must have either new format OR old format
    const hasNewFormat = artStyle && colorPalette && subject;
    const hasOldFormat = theme && palette && style && emotion;
    
    if (!hasNewFormat && !hasOldFormat) {
      return res.status(400).json({ 
        error: 'Missing required options',
        details: 'Required fields: either (artStyle, colorPalette, subject) for new format or (theme, palette, style, emotion) for old format.'
      });
    }

    const options = hasNewFormat 
      ? { artStyle, colorPalette, subject }
      : { theme, palette, style, emotion, inspirationKeyword };

    console.log(`Generating image with options: ${JSON.stringify(options)}`);
    
    // Generate image
    const { imageUrl, prompt } = await ImageGeneratorService.generateImage(options);

    // Return just the image URL and prompt
    res.json({ 
      imageUrl,
      prompt 
    });
  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({ error: 'Failed to generate image', details: error.message });
  }
});

// Get user's drafts
router.get('/drafts', requireAuth, async (req, res) => {
  try {
    const { data: drafts, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(drafts);
  } catch (error) {
    console.error('Fetch drafts error:', error);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
});

// Delete a draft
router.delete('/drafts/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id); // Ensure user owns the draft

    if (error) throw error;

    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Delete draft error:', error);
    res.status(500).json({ error: 'Failed to delete draft' });
  }
});

module.exports = router; 