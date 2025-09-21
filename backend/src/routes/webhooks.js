const express = require('express');
const router = express.Router();
const prodigiService = require('../lib/prodigiPrintingService');
const supabase = require('../lib/supabase');
const OrderProcessor = require('../services/orderProcessor');

// Prodigi webhook handler
router.post('/prodigi', async (req, res) => {
  try {
    const { body, headers } = req;
    
    console.log('📥 Received Prodigi webhook:', {
      event: body.event,
      orderId: body.orderId,
      status: body.status,
      stage: body.stage
    });

    // Validate webhook signature (implement proper validation in production)
    const signature = headers['x-prodigi-signature'];
    if (!prodigiService.validateWebhookSignature(JSON.stringify(body), signature)) {
      console.error('❌ Invalid Prodigi webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Handle different webhook events
    switch (body.event) {
      case 'order.status.updated':
        await handleOrderStatusUpdate(body);
        break;
      
      case 'order.shipped':
        await handleOrderShipped(body);
        break;
      
      case 'order.delivered':
        await handleOrderDelivered(body);
        break;
      
      case 'order.created':
        console.log('✅ Order created in Prodigi:', body.orderId);
        break;
      
      case 'order.cancelled':
        await handleOrderCancellation(body);
        break;
      
      default:
        console.log('⚠️  Unhandled Prodigi webhook event:', body.event);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Prodigi webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleOrderStatusUpdate(webhookData) {
  try {
    const { orderId, status, stage } = webhookData;
    
    // Find our order by Prodigi order ID
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, status')
      .eq('print_job_id', orderId)
      .single();

    if (error || !order) {
      console.error('❌ Order not found for Prodigi order ID:', orderId);
      return;
    }

    // Map Prodigi status to our status
    const statusMapping = {
      'InProgress': 'in_production',
      'Complete': 'shipped',
      'Shipped': 'shipped',
      'Delivered': 'delivered'
    };

    const newStatus = statusMapping[stage] || status || 'in_production';

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ Failed to update order status:', updateError);
      return;
    }
    
    console.log('✅ Updated order status from Prodigi webhook:', {
      prodigiOrderId: orderId,
      ourOrderId: order.id,
      oldStatus: order.status,
      newStatus: newStatus,
      prodigiStage: stage
    });

    // Send status update email to customer
    await OrderProcessor.sendOrderStatusUpdateEmail(order.id, newStatus, {
      trackingNumber: webhookData.trackingNumber,
      estimatedDelivery: webhookData.estimatedDelivery
    });
  } catch (error) {
    console.error('❌ Error handling order status update:', error);
  }
}

async function handleOrderShipped(webhookData) {
  try {
    const { orderId } = webhookData;
    
    // Find our order by Prodigi order ID
    const { data: order, error } = await supabase
      .from('orders')
      .select('id')
      .eq('print_job_id', orderId)
      .single();

    if (error || !order) {
      console.error('❌ Order not found for Prodigi order ID:', orderId);
      return;
    }

    // Update order status to shipped
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'shipped',
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ Failed to update order status to shipped:', updateError);
      return;
    }

    console.log('🚚 Order shipped from Prodigi webhook:', {
      prodigiOrderId: orderId,
      ourOrderId: order.id
    });

    // Send shipped notification email to customer
    await OrderProcessor.sendOrderStatusUpdateEmail(order.id, 'shipped', {
      trackingNumber: webhookData.trackingNumber,
      estimatedDelivery: webhookData.estimatedDelivery
    });
  } catch (error) {
    console.error('❌ Error handling order shipped:', error);
  }
}

async function handleOrderDelivered(webhookData) {
  try {
    const { orderId } = webhookData;
    
    // Find our order by Prodigi order ID
    const { data: order, error } = await supabase
      .from('orders')
      .select('id')
      .eq('print_job_id', orderId)
      .single();

    if (error || !order) {
      console.error('❌ Order not found for Prodigi order ID:', orderId);
      return;
    }

    // Update order status to delivered
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ Failed to update order status to delivered:', updateError);
      return;
    }

    console.log('📦 Order delivered from Prodigi webhook:', {
      prodigiOrderId: orderId,
      ourOrderId: order.id
    });

    // Send delivered notification email to customer
    await OrderProcessor.sendOrderStatusUpdateEmail(order.id, 'delivered', {
      trackingNumber: webhookData.trackingNumber
    });
  } catch (error) {
    console.error('❌ Error handling order delivered:', error);
  }
}

async function handleOrderCancellation(webhookData) {
  try {
    const { orderId } = webhookData;
    
    // Find our order by Prodigi order ID
    const { data: order, error } = await supabase
      .from('orders')
      .select('id')
      .eq('print_job_id', orderId)
      .single();

    if (error || !order) {
      console.error('❌ Order not found for Prodigi order ID:', orderId);
      return;
    }

    // Update order status to cancelled
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ Failed to update order status to cancelled:', updateError);
      return;
    }

    console.log('❌ Order cancelled from Prodigi webhook:', {
      prodigiOrderId: orderId,
      ourOrderId: order.id
    });
  } catch (error) {
    console.error('❌ Error handling order cancellation:', error);
  }
}

module.exports = router; 