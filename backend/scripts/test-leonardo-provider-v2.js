require('dotenv').config();

// Set NODE_ENV to test to skip API key requirement
process.env.NODE_ENV = 'test';

// Test the LeonardoProvider with model validation
async function testLeonardoProvider() {
  console.log('=== Testing LeonardoProvider with Model Validation ===\n');

  // Test 1: Valid V1 model
  console.log('Test 1: Valid V1 Model (Kino 2.0)');
  try {
    process.env.LEONARDO_MODEL_ID = '05ce0082-2d80-4a2d-8653-4d1c85e2418e';
    const LeonardoProvider = require('../src/services/imageGeneration/LeonardoProvider');
    const provider1 = new LeonardoProvider();
    console.log('✅ Model:', provider1.model);
    console.log('✅ API Version:', provider1.getApiVersion());
    console.log('✅ Model Info:', provider1.getModelInfo());
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Valid V2 model
  console.log('Test 2: Valid V2 Model (Nano Banana Pro)');
  try {
    process.env.LEONARDO_MODEL_ID = 'gemini-image-2';
    // Need to clear the require cache to test with new env var
    delete require.cache[require.resolve('../src/services/imageGeneration/LeonardoProvider')];
    const LeonardoProvider = require('../src/services/imageGeneration/LeonardoProvider');
    const provider2 = new LeonardoProvider();
    console.log('✅ Model:', provider2.model);
    console.log('✅ API Version:', provider2.getApiVersion());
    console.log('✅ Model Info:', provider2.getModelInfo());
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 3: Invalid model (should fail)
  console.log('Test 3: Invalid Model (should fail with validation error)');
  try {
    process.env.LEONARDO_MODEL_ID = 'invalid-model-id';
    delete require.cache[require.resolve('../src/services/imageGeneration/LeonardoProvider')];
    const LeonardoProvider = require('../src/services/imageGeneration/LeonardoProvider');
    const provider3 = new LeonardoProvider();
    console.log('❌ Should have thrown an error but didn\'t!');
  } catch (error) {
    console.log('✅ Expected validation error:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 4: All available models
  console.log('Test 4: List all available models');
  delete require.cache[require.resolve('../src/services/imageGeneration/LeonardoProvider')];
  const providerModule = require('../src/services/imageGeneration/LeonardoProvider');

  // Access the LEONARDO_MODELS constant (we need to export it for this test)
  console.log('Available models:');
  console.log('V1 Models:');
  console.log('  - 05ce0082-2d80-4a2d-8653-4d1c85e2418e (Kino 2.0)');
  console.log('  - b24e16ff-06e3-43eb-8d33-4416c2d75876 (Phoenix)');
  console.log('  - 1e60896f-3c26-4296-8ecc-53e2afecc132 (Diffusion XL)');
  console.log('  - 291be633-cb24-434f-898f-e662799936ad (Kino XL)');
  console.log('  - 6b645e3a-d64f-4341-a6d8-7a3690fbf042 (Vision XL)');
  console.log('  - aa77f04e-3eec-4034-9c07-d0f619684628 (AlbedoBase XL)');
  console.log('V2 Models:');
  console.log('  - gemini-image-1 (Nano Banana)');
  console.log('  - gemini-image-2 (Nano Banana Pro)');
}

testLeonardoProvider();
