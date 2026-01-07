require('dotenv').config();
const axios = require('axios');

async function testLeonardoV2API() {
  console.log('=== Testing Leonardo V2 API (Nano Banana Pro) ===');

  if (!process.env.LEONARDO_API_KEY) {
    console.error('❌ LEONARDO_API_KEY not set in environment');
    process.exit(1);
  }

  console.log('API Key preview:', process.env.LEONARDO_API_KEY.substring(0, 10) + '...');
  console.log('\nAttempting to create generation with Nano Banana Pro...\n');

  try {
    const payload = {
      model: "gemini-image-2",
      parameters: {
        width: 1024,
        height: 1024,
        prompt: "A beautiful mountain landscape with vibrant colors",
        quantity: 1,
        prompt_enhance: "OFF"
      },
      public: false
    };

    console.log('Request payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      'https://cloud.leonardo.ai/api/rest/v2/generations',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ Success! V2 Generation response:');
    console.log(JSON.stringify(response.data, null, 2));

    // V2 API returns: { generate: { apiCreditCost, generationId } }
    const generationId = response.data?.generate?.generationId ||
                        response.data?.sdGenerationJob?.generationId ||
                        response.data?.generationId ||
                        response.data?.id;

    if (generationId) {
      console.log('\n✅ Generation ID:', generationId);
      console.log('\nYou can poll this ID using: GET /v1/generations/' + generationId);
    } else {
      console.log('\n⚠️ Could not find generation ID in response');
      console.log('Response keys:', Object.keys(response.data));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error details:', error);
    }
  }
}

testLeonardoV2API();
