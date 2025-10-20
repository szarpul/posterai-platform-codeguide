require('dotenv').config();
const { Leonardo } = require('@leonardo-ai/sdk');

async function testLeonardoAPICall() {
  console.log('=== Testing Leonardo API Call ===');
  
  const leonardo = new Leonardo({
    bearerAuth: process.env.LEONARDO_API_KEY
  });
  
  console.log('API Key preview:', process.env.LEONARDO_API_KEY.substring(0, 10) + '...');
  console.log('\nAttempting to create generation...\n');
  
  try {
    const generation = await leonardo.image.createGeneration({
      prompt: "A beautiful mountain landscape",
      modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876", // Leonardo Phoenix
      width: 1024,
      height: 1024,
      num_images: 1,
      guidance_scale: 7,
      num_inference_steps: 20
    });
    
    console.log('✅ Success! Generation response:');
    console.log(JSON.stringify(generation, null, 2));
    
    if (generation?.sdGenerationJob?.generationId) {
      console.log('\n✅ Generation ID:', generation.sdGenerationJob.generationId);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
  }
}

testLeonardoAPICall();

