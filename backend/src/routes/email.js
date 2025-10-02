const express = require('express');
const router = express.Router();
const EmailService = require('../services/emailService');

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

module.exports = router;
