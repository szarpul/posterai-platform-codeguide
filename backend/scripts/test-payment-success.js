const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';



async function testPaymentSuccess(orderId) {
  console.log('🧪 Testing Payment Success Flow...\n');

  if (!orderId) {
    console.log('❌ No order ID provided. Please:');
    console.log('   1. Start your backend: npm start');
    console.log('   2. Start your frontend: npm start');
    console.log('   3. Create an order via the frontend');
    console.log('   4. Get the order ID from the URL or database');
    console.log('   5. Run this test with: node test-payment-success.js <ORDER_ID>');
    return;
  }

  try {
    // Simulate a payment_intent.succeeded webhook
    const webhookPayload = {
      id: 'evt_test_payment_success',
      object: 'event',
      api_version: '2020-08-27',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'pi_test_payment_success',
          object: 'payment_intent',
          amount: 2999,
          currency: 'usd',
          metadata: {
            orderId: orderId
          },
          status: 'succeeded'
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: 'req_test',
        idempotency_key: null
      },
      type: 'payment_intent.succeeded'
    };

    console.log('📤 Sending payment success webhook...');
    console.log('Order ID:', orderId);

    // Send as raw JSON string for express.raw() middleware
    const response = await axios.post(`${BASE_URL}/orders/webhook`, JSON.stringify(webhookPayload), {
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature'
      }
    });

    console.log('✅ Webhook sent successfully!');
    console.log('Response:', response.data);

    // Wait a moment for processing
    console.log('\n⏳ Waiting for order processing...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('✅ Payment success test completed!');
    console.log('💡 Check your Supabase dashboard to see if the order status updated to "paid"');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 This might be due to webhook signature validation.');
      console.log('   For testing, you can temporarily disable signature validation in the webhook route.');
    }
  }
}

// Get order ID from command line argument
const orderId = process.argv[2];

// Run the test
testPaymentSuccess(orderId); 