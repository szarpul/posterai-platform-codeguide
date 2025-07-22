const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

// Test order ID from your session summary
const TEST_ORDER_ID = '22de3d9f-aab5-4d9f-b3c8-b5332bf11625';
const PAYMENT_INTENT_ID = 'pi_3RmY6pCZQ5NBshkG0D0o5R3h';

async function testOrderEndpoints() {
  console.log('🧪 Testing Order Endpoints...\n');

  try {
    // Test 1: Get order details (will fail without auth token)
    console.log('1. Testing GET /api/orders/{id} (without auth)...');
    try {
      const response = await axios.get(`${BASE_URL}/orders/${TEST_ORDER_ID}`);
      console.log('✅ Order retrieved:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected without auth token');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 2: Test webhook endpoint (should work without auth)
    console.log('\n2. Testing POST /api/orders/webhook...');
    try {
      const webhookPayload = {
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: PAYMENT_INTENT_ID,
            metadata: {
              orderId: TEST_ORDER_ID
            }
          }
        }
      };

      await axios.post(`${BASE_URL}/orders/webhook`, webhookPayload, {
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'test_signature'
        }
      });
      console.log('✅ Webhook endpoint accessible');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Webhook endpoint accessible (expected signature error)');
      } else {
        console.log('❌ Webhook error:', error.response?.data || error.message);
      }
    }

    // Test 3: Health check
    console.log('\n3. Testing health endpoint...');
    try {
      const response = await axios.get('http://localhost:4000/health');
      console.log('✅ Backend is running:', response.data);
    } catch (error) {
      console.log('❌ Backend health check failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testOrderEndpoints(); 