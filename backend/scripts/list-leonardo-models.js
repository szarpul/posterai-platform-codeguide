require('dotenv').config();
const { Leonardo } = require('@leonardo-ai/sdk');

async function listLeonardoModels() {
  console.log('=== Fetching Available Leonardo.ai Models ===\n');
  
  const leonardo = new Leonardo({
    bearerAuth: process.env.LEONARDO_API_KEY
  });
  
  try {
    // Try to get platform models
    const models = await leonardo.models.listPlatformModels();
    
    console.log('Available Models:\n');
    
    if (models?.object?.custom_models) {
      models.object.custom_models.forEach(model => {
        console.log(`Name: ${model.name}`);
        console.log(`ID: ${model.id}`);
        console.log(`Description: ${model.description || 'N/A'}`);
        console.log('---');
      });
    } else {
      console.log('Full response:', JSON.stringify(models, null, 2));
    }
  } catch (error) {
    console.error('Error fetching models:', error.message);
    console.log('\nYou can also find model IDs at:');
    console.log('https://docs.leonardo.ai/docs/list-platform-models');
  }
}

listLeonardoModels();

