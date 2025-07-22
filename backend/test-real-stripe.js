const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';
const TEST_ORDER_ID = '22de3d9f-aab5-4d9f-b3c8-b5332bf11625';

async function testRealStripe() {
  console.log('🧪 Testing Real Stripe Integration...\n');

  try {
    // First, let's create a payment intent for our test order
    console.log('📤 Creating payment intent for order:', TEST_ORDER_ID);
    
    const response = await axios.post(`${BASE_URL}/orders/${TEST_ORDER_ID}/payment`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_AUTH_TOKEN' // You'll need a real auth token
      }
    });

    console.log('✅ Payment intent created:', response.data);
    console.log('💡 Now run: stripe trigger payment_intent.succeeded');
    console.log('   This will send a real webhook to your backend!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 This might be due to missing auth token.');
    console.log('   For now, the stripe trigger command you just ran should have worked!');
  }
}

// Run the test
testRealStripe(); 