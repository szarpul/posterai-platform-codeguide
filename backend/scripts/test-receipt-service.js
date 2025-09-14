const ReceiptService = require('../src/services/receiptService');

async function testReceiptService() {
  console.log('🧪 Testing Receipt Service...\n');
  
  try {
    // Test 1: Basic service functionality
    console.log('📋 Test 1: Basic service test');
    const testResult = await ReceiptService.testReceiptService();
    console.log('✅ Result:', testResult);
    console.log('');
    
    // Test 2: Check if Stripe is connected
    if (testResult.stripeConnected) {
      console.log('✅ Stripe connection successful');
    } else {
      console.log('❌ Stripe connection failed');
    }
    
    console.log('\n🎯 Receipt service test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testReceiptService()
  .then(() => {
    console.log('\n🏁 Test script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test script crashed:', error);
    process.exit(1);
  });
