const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listRecentOrders() {
  try {
    console.log('🔍 Fetching recent orders...');
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        amount_cents,
        created_at,
        user_id,
        shipping_address
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    console.log(`📋 Found ${orders.length} recent orders:\n`);
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order.id}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Amount: $${(order.amount_cents / 100).toFixed(2)}`);
      console.log(`   Created: ${new Date(order.created_at).toLocaleString()}`);
      console.log(`   User: ${order.user_id}`);
      console.log('');
    });

    if (orders.length > 0) {
      console.log('💡 To test payment webhook, run:');
      console.log(`   node scripts/test-payment-success.js ${orders[0].id}`);
    }

  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
  }
}

listRecentOrders(); 