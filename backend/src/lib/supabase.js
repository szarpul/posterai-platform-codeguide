const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test the connection
supabase.from('questionnaire_options').select('count').single()
  .then(() => console.log('Successfully connected to Supabase'))
  .catch(err => console.error('Supabase connection error:', err.message));

// Ensure the posters bucket exists
const initStorage = async () => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }
    
    // If bucket doesn't exist, create it
    const postersBucketExists = buckets.some(bucket => bucket.name === 'posters');
    
    if (!postersBucketExists) {
      console.log('Creating posters bucket in Supabase storage');
      const { error: createError } = await supabase.storage.createBucket('posters', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg']
      });
      
      if (createError) {
        throw createError;
      }
      
      console.log('Posters bucket created successfully');
    } else {
      console.log('Posters bucket already exists');
    }
  } catch (error) {
    console.error('Error initializing storage:', error.message);
  }
};

// Run initialization
initStorage();

module.exports = supabase; 