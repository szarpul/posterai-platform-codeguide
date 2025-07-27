const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your backend/.env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listOrders() {
  console.log('📋 Listing orders from database...\n');

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, status, created_at, user_id, size, finish')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    if (orders.length === 0) {
      console.log('📭 No orders found in database');
      console.log('💡 Create an order via the frontend first');
      return;
    }

    console.log(`📦 Found ${orders.length} orders:\n`);
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order.id}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Size: ${order.size}, Finish: ${order.finish}`);
      console.log(`   Created: ${new Date(order.created_at).toLocaleString()}`);
      console.log(`   User ID: ${order.user_id}`);
      console.log('');
    });

    console.log('💡 Use any of these order IDs for testing:');
    console.log(`   node test-payment-success.js ${orders[0].id}`);

  } catch (error) {
    console.error('❌ Error listing orders:', error.message);
  }
}

// Run the script
listOrders(); 