const express = require('express');
const router = express.Router();
const EmailService = require('../services/emailService');
const EmailUtils = require('../utils/emailUtils');

// Create email service instance
const emailService = new EmailService();

// Test order confirmation email endpoint
router.post('/test-order-confirmation', async (req, res) => {
  try {
    const { orderId, customerEmail } = req.body;
    
    if (!orderId || !customerEmail) {
      return res.status(400).json({
        error: 'orderId and customerEmail are required'
      });
    }

    console.log('📧 Testing order confirmation email...');
    
    const result = await emailService.sendOrderConfirmation(orderId, customerEmail);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Order confirmation email sent successfully',
        messageId: result.messageId,
        orderId: result.orderId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Order confirmation email test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send print instructions email
router.post('/instructions', async (req, res) => {
  try {
    const { email, imageUrl, responses } = req.body;

    if (!email || !EmailUtils.isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const selections = [
      responses?.artStyle ? { label: 'Style', value: responses.artStyle } : null,
      responses?.colorPalette ? { label: 'Palette', value: responses.colorPalette } : null,
      responses?.subject ? { label: 'Subject', value: responses.subject } : null,
    ].filter(Boolean).map((item) => ({
      label: EmailUtils.sanitizeEmailContent(item.label),
      value: EmailUtils.sanitizeEmailContent(item.value),
    }));

    const instructionData = {
      imageUrl: EmailUtils.sanitizeEmailContent(imageUrl),
      selections,
    };

    const result = await emailService.sendPrintInstructions(email, instructionData);

    res.json({
      success: true,
      message: 'Print instructions sent successfully',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Print instructions error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
