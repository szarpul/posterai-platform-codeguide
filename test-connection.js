const { Client } = require('pg');

// Replace [YOUR-PASSWORD] with the actual password
const connectionString = "postgresql://postgres.fjulqpbgsbmtxmackrel:wdh8wjn7qfh*CRM*zqh@aws-0-eu-north-1.pooler.supabase.com:6543/postgres";

async function testConnection() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Supabase connections
    }
  });

  try {
    await client.connect();
    console.log('Successfully connected to Supabase!');
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    await client.end();
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
  }
}

testConnection(); 