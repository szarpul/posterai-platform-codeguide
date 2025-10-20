require('dotenv').config();

console.log('=== Leonardo Environment Check ===');
console.log('LEONARDO_API_KEY exists:', !!process.env.LEONARDO_API_KEY);
console.log('LEONARDO_API_KEY length:', process.env.LEONARDO_API_KEY?.length || 0);
console.log('LEONARDO_API_KEY preview:', process.env.LEONARDO_API_KEY ? 
  process.env.LEONARDO_API_KEY.substring(0, 10) + '...' : 
  'NOT SET');
console.log('IMAGE_GENERATION_PROVIDER:', process.env.IMAGE_GENERATION_PROVIDER);
console.log('LEONARDO_MODEL:', process.env.LEONARDO_MODEL);
console.log('\n=== Trying to initialize Leonardo SDK ===');

try {
  const { Leonardo } = require('@leonardo-ai/sdk');
  const leonardo = new Leonardo({
    apiKey: process.env.LEONARDO_API_KEY
  });
  console.log('✅ Leonardo SDK initialized successfully');
  console.log('Leonardo instance:', !!leonardo);
  console.log('Leonardo.image:', !!leonardo.image);
} catch (error) {
  console.error('❌ Failed to initialize Leonardo SDK:', error.message);
}

