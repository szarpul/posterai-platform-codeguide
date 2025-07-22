const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:4000/api';
const TEST_ORDER_ID = '22de3d9f-aab5-4d9f-b3c8-b5332bf11625';
const PAYMENT_INTENT_ID = 'pi_3RmY6pCZQ5NBshkG0D0o5R3h';

// Mock webhook secret (you should use your actual STRIPE_WEBHOOK_SECRET)
const WEBHOOK_SECRET = 'whsec_test_secret';

function createWebhookSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

async function testWebhook() {
  console.log('🧪 Testing Webhook Payment Success...\n');

  try {
    // Create webhook payload for payment_intent.succeeded
    const webhookPayload = {
      id: 'evt_test_webhook',
      object: 'event',
      api_version: '2020-08-27',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: PAYMENT_INTENT_ID,
          object: 'payment_intent',
          amount: 2999,
          currency: 'usd',
          metadata: {
            orderId: TEST_ORDER_ID,
            draftId: 'test-draft-id',
            userId: 'test-user-id'
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

    const payloadString = JSON.stringify(webhookPayload);
    const signature = createWebhookSignature(payloadString, WEBHOOK_SECRET);

    console.log('📤 Sending webhook payload...');
    console.log('Order ID:', TEST_ORDER_ID);
    console.log('Payment Intent ID:', PAYMENT_INTENT_ID);

    const response = await axios.post(`${BASE_URL}/orders/webhook`, payloadString, {
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature
      }
    });

    console.log('✅ Webhook processed successfully!');
    console.log('Response:', response.data);

    // Now let's check if the order status was updated
    console.log('\n🔍 Checking order status update...');
    
    // Note: This will fail without auth, but we can see if the webhook worked
    try {
      const orderResponse = await axios.get(`${BASE_URL}/orders/${TEST_ORDER_ID}`);
      console.log('✅ Order retrieved:', orderResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('ℹ️  Order endpoint requires auth (expected)');
        console.log('💡 To verify order status, check your Supabase dashboard or use an auth token');
      } else {
        console.log('❌ Order retrieval error:', error.response?.data || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Webhook test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 This might be due to webhook signature validation.');
      console.log('   In production, you would use the actual STRIPE_WEBHOOK_SECRET.');
      console.log('   For testing, you can temporarily disable signature validation.');
    }
  }
}

// Run the test
testWebhook(); 