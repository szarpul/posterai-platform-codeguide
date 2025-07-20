const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const supabase = require('../lib/supabase');

// Create a new draft
router.post('/', requireAuth, async (req, res) => {
  try {
    const { responses, imageUrl, prompt, options } = req.body;
    
    // Validate required fields
    if (!responses || !imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create draft in database
    const { data: draft, error } = await supabase
      .from('drafts')
      .insert([{
        user_id: req.user.id,
        image_url: imageUrl,
        prompt: JSON.stringify(prompt || responses), // Use prompt if provided, fallback to responses
        options: options || responses // Use options if provided, fallback to responses
      }])
      .select()
      .single();

    if (error) throw error;

    res.json(draft);
  } catch (error) {
    console.error('Create draft error:', error);
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

// Get all drafts for the current user
router.get('/', requireAuth, async (req, res) => {
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

module.exports = router; 