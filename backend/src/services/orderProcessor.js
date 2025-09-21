const stripe = require('../lib/stripe');
const supabase = require('../lib/supabase');
const PrintingManager = require('./printingManager');
const ReceiptService = require('./receiptService');
const EmailService = require('./emailService');

const POSTER_PRICES = {
  'A4': {
    'matte': 2999, // $29.99
    'glossy': 3499 // $34.99
  },
  'A3': {
    'matte': 3999, // $39.99
    'glossy': 4499 // $44.99
  },
  'A2': {
    'matte': 4999, // $49.99
    'glossy': 5499 // $54.99
  }
};

class OrderProcessor {
  static calculatePrice(size, finish) {
    const priceInCents = POSTER_PRICES[size]?.[finish];
    if (!priceInCents) {
      throw new Error('Invalid size or finish selected');
    }
    return priceInCents;
  }

  static async createOrder(userId, draftId, orderDetails) {
    const { size, finish, shippingAddress } = orderDetails;

    // Validate draft exists and belongs to user
    const { data: draft, error: draftError } = await supabase
      .from('drafts')
      .select('*')
      .eq('id', draftId)
      .eq('user_id', userId)
      .single();

    if (draftError || !draft) {
      throw new Error('Draft not found or unauthorized');
    }

    const amountInCents = this.calculatePrice(size, finish);

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        draft_id: draftId,
        size,
        finish,
        amount_cents: amountInCents,
        shipping_address: shippingAddress,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error details:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Send order confirmation email
    await this.sendOrderConfirmationEmail(order, draft, userId);

    return order;
  }

  /**
   * Send order confirmation email
   * @param {Object} order - Order object
   * @param {Object} draft - Draft object
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async sendOrderConfirmationEmail(order, draft, userId) {
    try {
      console.log('📧 Sending order confirmation email for order:', order.id);
      
      // Get user email
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !user.user?.email) {
        console.warn('⚠️  User email not found, skipping order confirmation email');
        return;
      }

      // Prepare order data with draft information
      const orderWithDraft = {
        ...order,
        drafts: draft
      };
      
      await EmailService.sendOrderConfirmation(order.id, user.user.email, orderWithDraft);
      console.log('✅ Order confirmation email sent successfully');
      
    } catch (emailError) {
      console.error('⚠️  Order confirmation email failed, but continuing with order creation:', emailError.message);
      // Don't fail the entire order creation if email fails
    }
  }

  /**
   * Send order status update email
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data (tracking number, etc.)
   * @returns {Promise<void>}
   */
  static async sendOrderStatusUpdateEmail(orderId, status, additionalData = {}) {
    try {
      console.log('📧 Sending order status update email for order:', orderId);
      
      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, drafts(*)')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        console.warn('⚠️  Order not found, skipping status update email');
        return;
      }

      // Get user email
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(order.user_id);
      
      if (userError || !user.user?.email) {
        console.warn('⚠️  User email not found, skipping status update email');
        return;
      }

      await EmailService.sendOrderStatusUpdate(orderId, user.user.email, status, additionalData);
      console.log('✅ Order status update email sent successfully');
      
    } catch (emailError) {
      console.error('⚠️  Order status update email failed:', emailError.message);
      // Don't fail the entire process if email fails
    }
  }

  static async createPaymentIntent(orderId) {
    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, drafts(*)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      throw new Error('Order not found');
    }

    // Get user email for receipt
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(order.user_id);
    if (userError || !user.user?.email) {
      throw new Error('User email not found');
    }

    // Create Stripe PaymentIntent with receipt_email
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.amount_cents,
      currency: 'pln', // Use PLN for Polish account
      receipt_email: user.user.email, // This will automatically send receipt
      metadata: {
        orderId: order.id,
        draftId: order.draft_id,
        userId: order.user_id
      }
    });

    // Update order with payment intent ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_intent_id: paymentIntent.id })
      .eq('id', orderId);

    if (updateError) {
      throw new Error('Failed to update order with payment intent');
    }

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    };
  }

  static async handlePaymentSuccess(paymentIntent) {
    const { orderId } = paymentIntent.metadata;

    // Skip if no orderId in metadata (might be a test webhook)
    if (!orderId) {
      console.log('⚠️  Skipping payment success - no orderId in metadata');
      return { status: 'skipped', reason: 'no_order_id' };
    }

    try {
      console.log('🔄 Processing payment success for order:', orderId);

      // First, get the order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, drafts(*)')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        throw new Error(`Order not found: ${orderId}`);
      }

      console.log('📋 Found order:', { id: order.id, status: order.status, userId: order.user_id });

      // Update order status to paid
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw new Error('Failed to update order status');
      }

      console.log('✅ Order status updated to paid:', orderId);

      // Get customer email for receipt
      console.log('🔍 Attempting to get user email for user ID:', order.user_id);
      
      let receiptSent = false;
      let userEmail = null;
      
      try {
        const { data: user, error: userError } = await supabase.auth.admin.getUserById(order.user_id);
        
        if (userError) {
          console.error('❌ Error getting user:', userError);
          console.warn('⚠️  Customer email not found, skipping receipt');
        } else if (!user.user?.email) {
          console.warn('⚠️  User found but no email:', user);
          console.warn('⚠️  Customer email not found, skipping receipt');
        } else {
          console.log('📧 Found customer email:', user.user.email);
          userEmail = user.user.email;
          
          // Send payment receipt
          try {
            await ReceiptService.sendPaymentReceipt(orderId, user.user.email, order);
            console.log('📧 Payment receipt sent successfully');
            receiptSent = true;
          } catch (receiptError) {
            console.error('⚠️  Receipt sending failed, but continuing with order processing:', receiptError.message);
            // Don't fail the entire order process if receipt fails
          }
        }
      } catch (userLookupError) {
        console.error('❌ Exception during user lookup:', userLookupError);
        console.warn('⚠️  Customer email lookup failed, skipping receipt');
      }

      // Create print job
      const printJob = await PrintingManager.createPrintJob(orderId);

      return { 
        orderId,
        printJobId: printJob.id,
        status: 'in_production',
        receiptSent: receiptSent,
        userEmail: userEmail
      };
    } catch (error) {
      console.error('Payment success handling error:', error);
      // If print job creation fails, we should handle this case
      // Maybe add the order to a retry queue or notify admin
      throw error;
    }
  }
}

module.exports = OrderProcessor; 