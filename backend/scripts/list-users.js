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

async function listUsers() {
  console.log('👥 Listing users from auth.users...\n');

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    if (users.users.length === 0) {
      console.log('📭 No users found in auth.users');
      console.log('💡 Create a user via the frontend first');
      return;
    }

    console.log(`👥 Found ${users.users.length} users:\n`);
    
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   Email: ${user.email || 'No email'}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`   Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);
      console.log('');
    });

    console.log('💡 Use any of these user IDs for testing:');
    console.log(`   node test-complete-order-flow.js ${users.users[0].id}`);

  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  }
}

// Run the script
listUsers(); 