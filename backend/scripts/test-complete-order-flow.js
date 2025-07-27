const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const BASE_URL = 'http://localhost:4000/api';

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your backend/.env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestDraft(userId) {
  console.log('🎨 Creating test draft...');
  
  try {
    const draftData = {
      user_id: userId,
      options: {
        style: 'modern',
        theme: 'nature',
        mood: 'calm',
        palette: 'warm',
        subject: 'landscapes'
      },
      prompt: 'A modern nature landscape with calm mood and warm palette',
      image_url: 'https://example.com/test-image.jpg'
    };

    const { data: draft, error } = await supabase
      .from('drafts')
      .insert(draftData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Draft created:', draft.id);
    return draft;
  } catch (error) {
    console.error('❌ Failed to create draft:', error.message);
    return null;
  }
}

async function createTestOrder(draftId, userId) {
  console.log('📦 Creating test order...');
  
  try {
    const orderData = {
      user_id: userId,
      draft_id: draftId,
      size: 'A4',
      finish: 'matte',
      amount_cents: 2999,
      status: 'pending',
      shipping_address: {
        name: 'Test User',
        address: '123 Test Street',
        city: 'Test City',
        postal_code: '12345',
        country: 'PL'
      }
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Order created:', order.id);
    console.log('   Status:', order.status);
    console.log('   Price:', `$${(order.amount_cents / 100).toFixed(2)}`);
    return order;
  } catch (error) {
    console.error('❌ Failed to create order:', error.message);
    return null;
  }
}

async function testPaymentWebhook(orderId) {
  console.log('🧪 Testing payment webhook...');
  
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

    const response = await axios.post(`${BASE_URL}/orders/webhook`, JSON.stringify(webhookPayload), {
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature'
      }
    });

    console.log('✅ Webhook sent successfully!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Webhook test failed:', error.response?.data || error.message);
    return false;
  }
}

async function verifyOrderStatus(orderId) {
  console.log('🔍 Verifying order status...');
  
  try {
    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      throw error;
    }

    console.log('📊 Order status after webhook:');
    console.log('   ID:', order.id);
    console.log('   Status:', order.status);
    console.log('   Updated at:', new Date(order.updated_at).toLocaleString());

    if (order.status === 'paid' || order.status === 'in_production') {
      console.log('✅ SUCCESS: Order status updated to "' + order.status + '"!');
      console.log('   💡 Note: Status "in_production" means payment succeeded and print job was created');
      return true;
    } else {
      console.log('❌ FAILED: Order status is still', order.status);
      console.log('   💡 Expected: "paid" or "in_production"');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to verify order status:', error.message);
    return false;
  }
}

async function cleanupTestData(draftId, orderId, userId) {
  console.log('🧹 Cleaning up test data...');
  
  try {
    // Delete the order
    if (orderId) {
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (orderError) {
        console.log('⚠️  Could not delete order:', orderError.message);
      } else {
        console.log('✅ Test order deleted');
      }
    }

    // Delete the draft
    if (draftId) {
      const { error: draftError } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draftId);
      
      if (draftError) {
        console.log('⚠️  Could not delete draft:', draftError.message);
      } else {
        console.log('✅ Test draft deleted');
      }
    }

    // Delete the test user
    if (userId) {
      const { error: userError } = await supabase.auth.admin.deleteUser(userId);
      
      if (userError) {
        console.log('⚠️  Could not delete test user:', userError.message);
      } else {
        console.log('✅ Test user deleted');
      }
    }
  } catch (error) {
    console.log('⚠️  Cleanup error:', error.message);
  }
}

async function runCompleteTest(userId) {
  console.log('🚀 Starting Complete Order Flow Test...\n');

  let draft = null;
  let order = null;
  let success = false;

  try {
    // Step 1: Create test draft
    draft = await createTestDraft(userId);
    if (!draft) {
      throw new Error('Failed to create draft');
    }

    // Step 2: Create test order
    order = await createTestOrder(draft.id, userId);
    if (!order) {
      throw new Error('Failed to create order');
    }

    // Step 3: Test payment webhook
    const webhookSuccess = await testPaymentWebhook(order.id);
    if (!webhookSuccess) {
      throw new Error('Webhook test failed');
    }

    // Step 4: Verify order status
    const statusVerified = await verifyOrderStatus(order.id);
    if (!statusVerified) {
      throw new Error('Order status verification failed');
    }

    success = true;
    console.log('\n🎉 COMPLETE TEST SUCCESS!');
    console.log('✅ Draft created and order flow tested successfully');
    console.log('✅ Payment webhook processed correctly');
    console.log('✅ Order status updated to "paid" or "in_production"');
    console.log('✅ Print job created (if status is "in_production")');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    success = false;
  } finally {
    // Step 5: Cleanup (optional - comment out if you want to keep test data)
    console.log('\n---');
    const cleanup = process.argv.includes('--keep-data') ? false : true;
    
    if (cleanup) {
      await cleanupTestData(draft?.id, order?.id, userId);
    } else {
      console.log('🧹 Skipping cleanup (--keep-data flag used)');
      if (order) {
        console.log('💡 Test order ID for manual testing:', order.id);
      }
    }
  }

  return success;
}

// Check if backend is running
async function checkBackendHealth() {
  try {
    await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    return true;
  } catch (error) {
    return false;
  }
}

// Create a test user
async function createTestUser() {
  console.log('👤 Creating test user...');
  
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });

    if (error) {
      throw error;
    }

    console.log('✅ Test user created:', user.user.id);
    console.log('   Email:', testEmail);
    return user.user.id;
  } catch (error) {
    console.error('❌ Failed to create test user:', error.message);
    return null;
  }
}

// Run complete test with new user
async function runCompleteTestWithNewUser() {
  console.log('🚀 Starting Complete Order Flow Test with New User...\n');

  let userId = null;
  let draft = null;
  let order = null;
  let success = false;

  try {
    // Step 0: Create test user
    userId = await createTestUser();
    if (!userId) {
      throw new Error('Failed to create test user');
    }

    // Step 1: Create test draft
    draft = await createTestDraft(userId);
    if (!draft) {
      throw new Error('Failed to create draft');
    }

    // Step 2: Create test order
    order = await createTestOrder(draft.id, userId);
    if (!order) {
      throw new Error('Failed to create order');
    }

    // Step 3: Test payment webhook
    const webhookSuccess = await testPaymentWebhook(order.id);
    if (!webhookSuccess) {
      throw new Error('Webhook test failed');
    }

    // Step 4: Verify order status
    const statusVerified = await verifyOrderStatus(order.id);
    if (!statusVerified) {
      throw new Error('Order status verification failed');
    }

    success = true;
    console.log('\n🎉 COMPLETE TEST SUCCESS!');
    console.log('✅ Test user created successfully');
    console.log('✅ Draft created and order flow tested successfully');
    console.log('✅ Payment webhook processed correctly');
    console.log('✅ Order status updated to "paid" or "in_production"');
    console.log('✅ Print job created (if status is "in_production")');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    success = false;
  } finally {
    // Step 5: Cleanup (optional - comment out if you want to keep test data)
    console.log('\n---');
    const cleanup = process.argv.includes('--keep-data') ? false : true;
    
    if (cleanup) {
      await cleanupTestData(draft?.id, order?.id, userId);
    } else {
      console.log('🧹 Skipping cleanup (--keep-data flag used)');
      if (order) {
        console.log('💡 Test order ID for manual testing:', order.id);
      }
      if (userId) {
        console.log('💡 Test user ID for manual testing:', userId);
      }
    }
  }

  return success;
}

// Main execution
async function main() {
  console.log('🔍 Checking backend health...');
  const backendHealthy = await checkBackendHealth();
  
  if (!backendHealthy) {
    console.error('❌ Backend is not running!');
    console.log('💡 Please start your backend first:');
    console.log('   cd backend && npm start');
    process.exit(1);
  }

  console.log('✅ Backend is running\n');

  // Check if user ID is provided as argument
  const userId = process.argv[2];
  
  if (userId) {
    console.log(`👤 Using provided user ID: ${userId}`);
    const success = await runCompleteTest(userId);
    process.exit(success ? 0 : 1);
  } else {
    console.log('⚠️  No user ID provided. Creating test user...');
    const success = await runCompleteTestWithNewUser();
    process.exit(success ? 0 : 1);
  }
}

// Run the test
main(); 