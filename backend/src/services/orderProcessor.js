const stripe = require('../lib/stripe');
const supabase = require('../lib/supabase');
const PrintingManager = require('./printingManager');

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

    return order;
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

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.amount_cents,
      currency: 'usd',
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

    try {
      // Update order status to paid
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        throw new Error('Failed to update order status');
      }

      // Create print job
      const printJob = await PrintingManager.createPrintJob(orderId);

      return { 
        orderId,
        printJobId: printJob.id,
        status: 'in_production'
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