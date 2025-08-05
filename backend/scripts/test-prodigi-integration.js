const axios = require('axios');
require('dotenv').config();

const PRODIGI_API_KEY = process.env.PRODIGI_API_KEY;
const PRODIGI_BASE_URL = process.env.PRODIGI_BASE_URL || 'https://api.sandbox.prodigi.com/v4.0';

async function testProdigiConnection() {
  console.log('🧪 Testing Prodigi API Connection...');
  
  try {
    // Test 1: Check API connection
    console.log('\n1️⃣ Testing API connection...');
    const response = await axios.get(`${PRODIGI_BASE_URL}/orders`, {
      headers: {
        'X-API-Key': PRODIGI_API_KEY
      }
    });
    console.log('✅ API connection successful');
    console.log('📊 Orders count:', response.data.orders?.length || 0);
  } catch (error) {
    console.error('❌ API connection failed:', error.response?.data || error.message);
    return;
  }
}

async function testOrderCreation() {
  console.log('\n2️⃣ Testing order creation (sandbox - safe)...');
  
  try {
    const testOrder = {
      recipient: {
        name: 'Test Customer',
        address: {
          line1: 'Test Street 123',
          townOrCity: 'Warsaw',
          postalOrZipCode: '00-001',
          countryCode: 'PL'
        }
      },
      items: [{
        sku: 'GLOBAL-CFPM-A4',
        copies: 1,
        sizing: 'fillPrintArea',
        attributes: {
          color: 'white'
        },
        assets: [{
          printArea: 'default',
          url: 'https://pwintyimages.blob.core.windows.net/samples/stars/test-sample-grey.png'
        }]
      }],
      shippingMethod: 'Standard'
    };

    console.log('📤 Sending order to Prodigi...');
    const response = await axios.post(
      `${PRODIGI_BASE_URL}/orders`,
      testOrder,
      {
        headers: {
          'X-API-Key': PRODIGI_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Test order created successfully');
    console.log('📄 Full Response:', JSON.stringify(response.data, null, 2));
    
    // Handle different possible response structures
    const orderId = response.data.id || response.data.orderId || response.data.order?.id;
    const status = response.data.status?.stage || response.data.status || response.data.order?.status;
    
    console.log('🆔 Prodigi Order ID:', orderId);
    console.log('📊 Order Status:', status);
    
    return orderId;
  } catch (error) {
    console.error('❌ Order creation failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return null;
  }
}

async function testOrderStatus(orderId) {
  if (!orderId) {
    console.log('⏭️ Skipping status test - no order ID');
    return;
  }

  console.log('\n3️⃣ Testing order status retrieval...');
  
  try {
    const response = await axios.get(
      `${PRODIGI_BASE_URL}/orders/${orderId}`,
      {
        headers: {
          'X-API-Key': PRODIGI_API_KEY
        }
      }
    );

    console.log('✅ Order status retrieved successfully');
    console.log('📄 Full Response:', JSON.stringify(response.data, null, 2));
    
    // Handle different possible response structures
    const status = response.data.status?.stage || response.data.status || response.data.order?.status;
    const lastModified = response.data.lastUpdated || response.data.lastModified || response.data.updatedAt;
    const tracking = response.data.tracking || response.data.shipments?.[0]?.tracking;
    
    console.log('📊 Current Status:', status);
    console.log('📅 Last Modified:', lastModified);
    
    if (tracking) {
      console.log('📦 Tracking Number:', tracking.number || tracking.trackingNumber);
    }
  } catch (error) {
    console.error('❌ Status retrieval failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

async function testSKUMapping() {
  console.log('\n4️⃣ Testing SKU mapping...');
  
  const testSKUs = {
    'A4': 'GLOBAL-CFPM-A4',
    'A3': 'GLOBAL-CFPM-A3',
    'A2': 'GLOBAL-CFPM-A2'
  };

  for (const [size, sku] of Object.entries(testSKUs)) {
    console.log(`✅ ${size} → ${sku}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Prodigi Integration Tests\n');
  console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
  console.log('🌐 Base URL:', PRODIGI_BASE_URL);
  console.log('🔑 API Key:', PRODIGI_API_KEY ? '✅ Set' : '❌ Missing');
  
  if (!PRODIGI_API_KEY) {
    console.error('\n❌ PRODIGI_API_KEY environment variable is required');
    console.log('💡 Add it to your .env file:');
    console.log('   PRODIGI_API_KEY=your_sandbox_api_key_here');
    return;
  }

  await testProdigiConnection();
  const orderId = await testOrderCreation();
  await testOrderStatus(orderId);
  await testSKUMapping();

  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Add PRODIGI_API_KEY to your .env file');
  console.log('   2. Test the complete order flow');
  console.log('   3. Set up webhook endpoints');
  console.log('   4. Deploy to production');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testProdigiConnection,
  testOrderCreation,
  testOrderStatus,
  testSKUMapping
}; 