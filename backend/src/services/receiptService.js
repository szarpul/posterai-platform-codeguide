const stripe = require('../lib/stripe');
const supabase = require('../lib/supabase');

class ReceiptService {
  /**
   * Send a payment receipt for a successful order
   * @param {string} orderId - The order ID
   * @param {string} customerEmail - Customer's email address
   * @param {Object} orderData - Optional order data (if already fetched)
   * @returns {Promise<Object>} Receipt details
   */
  static async sendPaymentReceipt(orderId, customerEmail, orderData = null) {
    try {
      console.log('📧 Processing payment receipt for order:', orderId);
      
      let order = orderData;
      
      // If order data not provided, fetch it from database
      if (!order) {
        const { data: fetchedOrder, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            drafts (
              id,
              questionnaire,
              image_url
            )
          `)
          .eq('id', orderId)
          .single();

        if (orderError || !fetchedOrder) {
          throw new Error(`Order not found: ${orderId}`);
        }
        order = fetchedOrder;
      }

      // Get the payment intent to retrieve Stripe receipt
      const { data: orderWithPayment, error: paymentError } = await supabase
        .from('orders')
        .select('payment_intent_id')
        .eq('id', orderId)
        .single();

      if (paymentError || !orderWithPayment.payment_intent_id) {
        throw new Error('Payment intent not found for order');
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(
        orderWithPayment.payment_intent_id
      );

      // Get the charge details for receipt
      const charge = paymentIntent.latest_charge 
        ? await stripe.charges.retrieve(paymentIntent.latest_charge)
        : null;

      // Create receipt data
      const receiptData = {
        orderId: order.id,
        customerEmail: customerEmail,
        amount: order.amount_cents / 100, // Convert cents to PLN
        currency: 'pln',
        posterSize: order.size,
        posterFinish: order.finish,
        posterImage: order.drafts?.image_url,
        orderDate: order.created_at,
        paymentMethod: charge?.payment_method_details?.type || 'card',
        receiptNumber: charge?.receipt_number || `ORDER-${order.id}`,
        shippingAddress: order.shipping_address
      };

      console.log('📋 Receipt data prepared:', receiptData);

      // Store receipt info in database
      await this.storeReceiptInfo(orderId, {
        id: charge?.id || paymentIntent.id,
        receipt_number: receiptData.receiptNumber,
        receipt_url: charge?.receipt_url || paymentIntent.charges?.data[0]?.receipt_url
      });

      console.log('✅ Payment receipt processed successfully');
      
      return {
        success: true,
        receiptId: charge?.id || paymentIntent.id,
        receiptNumber: receiptData.receiptNumber,
        customerEmail: customerEmail,
        orderId: orderId,
        receiptUrl: charge?.receipt_url || paymentIntent.charges?.data[0]?.receipt_url
      };

    } catch (error) {
      console.error('❌ Failed to process payment receipt:', error);
      throw new Error(`Receipt processing failed: ${error.message}`);
    }
  }

  /**
   * Store receipt information in database
   * @param {string} orderId - Order ID
   * @param {Object} receipt - Receipt details from Stripe
   */
  static async storeReceiptInfo(orderId, receipt) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          receipt_sent_at: new Date().toISOString(),
          receipt_id: receipt.id,
          receipt_number: receipt.receipt_number,
          receipt_url: receipt.receipt_url
        })
        .eq('id', orderId);

      if (error) {
        console.error('⚠️  Failed to store receipt info:', error);
      } else {
        console.log('💾 Receipt info stored in database');
      }
    } catch (error) {
      console.error('⚠️  Error storing receipt info:', error);
    }
  }

  /**
   * Test method to verify receipt service is working
   * @returns {Promise<Object>} Test result
   */
  static async testReceiptService() {
    try {
      console.log('🧪 Testing Receipt Service...');
      
      // Test Stripe connection
      const testPaymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // 10 PLN
        currency: 'pln',
        receipt_email: 'test@example.com',
        metadata: { test: 'true' }
      });

      console.log('✅ Stripe connection successful');
      console.log('✅ Payment intent creation successful');

      // Clean up test payment intent
      await stripe.paymentIntents.cancel(testPaymentIntent.id);
      console.log('✅ Test cleanup successful');

      return {
        success: true,
        message: 'Receipt service is working correctly',
        stripeConnected: true,
        testPaymentIntentId: testPaymentIntent.id
      };

    } catch (error) {
      console.error('❌ Receipt service test failed:', error);
      return {
        success: false,
        error: error.message,
        stripeConnected: false
      };
    }
  }

  /**
   * Get receipt details for an order
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Receipt details
   */
  static async getReceiptDetails(orderId) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          id,
          receipt_sent_at,
          receipt_id,
          receipt_number,
          receipt_url,
          amount_cents,
          created_at,
          status
        `)
        .eq('id', orderId)
        .single();

      if (error || !order) {
        throw new Error('Order not found');
      }

      return {
        orderId: order.id,
        receiptSent: !!order.receipt_sent_at,
        receiptSentAt: order.receipt_sent_at,
        receiptId: order.receipt_id,
        receiptNumber: order.receipt_number,
        receiptUrl: order.receipt_url,
        amount: order.amount_cents / 100,
        orderDate: order.created_at,
        status: order.status
      };

    } catch (error) {
      console.error('❌ Failed to get receipt details:', error);
      throw new Error(`Failed to get receipt details: ${error.message}`);
    }
  }
}

module.exports = ReceiptService;
