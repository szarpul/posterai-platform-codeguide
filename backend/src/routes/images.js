const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ImageGeneratorService = require('../services/imageGenerator');
const { supabase } = require('../lib/supabase');

// Generate image from questionnaire options
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { style, theme, mood, colorPalette, subject } = req.body;
    
    // Validate required fields
    if (!style || !theme || !mood || !colorPalette || !subject) {
      return res.status(400).json({ error: 'Missing required options' });
    }

    // Generate image
    const { imageUrl, prompt } = await ImageGeneratorService.generateImage({
      style, theme, mood, colorPalette, subject
    });

    // Create draft in database
    const { data: draft, error: draftError } = await supabase
      .from('drafts')
      .insert([{
        user_id: req.user.id,
        image_url: imageUrl,
        prompt,
        options: { style, theme, mood, colorPalette, subject }
      }])
      .select()
      .single();

    if (draftError) throw draftError;

    res.json({ 
      imageUrl,
      draftId: draft.id,
      prompt 
    });
  } catch (error) {
    console.error('Image generation route error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
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