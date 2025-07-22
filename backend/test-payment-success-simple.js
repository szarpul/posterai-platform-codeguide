const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';
const TEST_ORDER_ID = '22de3d9f-aab5-4d9f-b3c8-b5332bf11625';

async function testPaymentSuccessSimple() {
  console.log('🧪 Testing Payment Success (Simple)...\n');

  try {
    // Simulate a payment_intent.succeeded webhook
    const webhookPayload = {
      id: 'evt_test_payment_success_simple',
      object: 'event',
      api_version: '2020-08-27',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'pi_test_payment_success_simple',
          object: 'payment_intent',
          amount: 2999,
          currency: 'usd',
          metadata: {
            orderId: TEST_ORDER_ID
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
    console.log('Order ID:', TEST_ORDER_ID);

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
    console.log('📋 Next steps:');
    console.log('   1. Run the migration: supabase/migrations/003_add_print_job_columns.sql');
    console.log('   2. Test the complete flow with print job creation');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testPaymentSuccessSimple(); 