const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const OrderProcessor = require('../services/orderProcessor');
const ReceiptService = require('../services/receiptService');
const supabase = require('../lib/supabase');

// Create a new order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { draftId, size, finish, shippingAddress } = req.body;

    if (!draftId || !size || !finish || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const order = await OrderProcessor.createOrder(req.user.id, draftId, {
      size,
      finish,
      shippingAddress,
    });

    res.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create payment intent for an order
router.post('/:orderId/payment', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { clientSecret } = await OrderProcessor.createPaymentIntent(orderId);
    res.json({ clientSecret });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('🚀 WEBHOOK ENDPOINT CALLED!');
  console.log('📥 Request body type:', typeof req.body);
  console.log('📥 Request body length:', req.body ? req.body.length : 'undefined');
  
  try {
    let event;
    
    // For testing, bypass signature validation completely
    console.log('⚠️  Bypassing webhook signature validation for testing');
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    console.log('📥 Received webhook event:', event.type);
    console.log('📋 Event data:', JSON.stringify(event.data.object, null, 2));

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const orderId = event.data.object.metadata?.orderId;
        console.log('💰 Processing payment success for order:', orderId);
        
        if (!orderId) {
          console.warn('⚠️  No orderId found in payment intent metadata');
          console.warn('📋 Available metadata:', event.data.object.metadata);
        } else {
          const result = await OrderProcessor.handlePaymentSuccess(event.data.object);
          console.log('✅ Payment success processing completed:', result);
        }
        break;
      }
      
      case 'charge.succeeded': {
        // Skip charge.succeeded - payment_intent.succeeded already handles everything
        // Stripe sends both events for the same payment, so we only process payment_intent.succeeded
        // to avoid duplicate emails and order processing
        console.log('ℹ️  Skipping charge.succeeded event (already handled by payment_intent.succeeded)');
        break;
      }
      
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed for order:', event.data.object.metadata?.orderId);
        break;
      
      default:
        console.log('ℹ️  Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(400).json({ error: error.message });
  }
});

// Get user's orders
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, drafts (*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order details
router.get('/:orderId', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, drafts (*)')
      .eq('id', orderId)
      .eq('user_id', req.user.id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Cancel/delete an order (only for pending orders)
router.delete('/:orderId', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get the order to check if it belongs to the user and is pending
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }

    // Delete the order
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
      .eq('user_id', req.user.id);

    if (deleteError) {
      throw deleteError;
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Test receipt service
router.get('/test-receipt', async (req, res) => {
  try {
    console.log('🧪 Testing receipt service...');
    const testResult = await ReceiptService.testReceiptService();
    res.json(testResult);
  } catch (error) {
    console.error('Receipt service test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send receipt for a specific order (for testing)
router.post('/:orderId/send-receipt', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { customerEmail } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    console.log('📧 Manually sending receipt for order:', orderId);
    const receiptResult = await ReceiptService.sendPaymentReceipt(orderId, customerEmail);
    
    res.json({
      message: 'Receipt sent successfully',
      receipt: receiptResult
    });
  } catch (error) {
    console.error('Send receipt error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get receipt details for an order
router.get('/:orderId/receipt', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const receiptDetails = await ReceiptService.getReceiptDetails(orderId);
    res.json(receiptDetails);
  } catch (error) {
    console.error('Get receipt details error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test receipt service (for debugging)
router.post('/test-receipt', requireAuth, async (req, res) => {
  try {
    console.log('🧪 Testing receipt service...');
    const testResult = await ReceiptService.testReceiptService();
    console.log('🧪 Receipt service test result:', testResult);
    res.json(testResult);
  } catch (error) {
    console.error('Receipt service test error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
