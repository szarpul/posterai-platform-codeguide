const leonardo = require('../../lib/leonardo');
const axios = require('axios');

/**
 * Model registry mapping model IDs to API configuration
 * V1 models use UUID identifiers and the /v1/generations endpoint
 * V2 models use string identifiers and the /v2/generations endpoint
 */
const LEONARDO_MODELS = {
  // V1 Models (UUID-based, diffusion models)
  'b24e16ff-06e3-43eb-8d33-4416c2d75876': {
    name: 'Leonardo Phoenix',
    apiVersion: 'v1',
    description: 'Fast generation, good quality'
  },
  '1e60896f-3c26-4296-8ecc-53e2afecc132': {
    name: 'Leonardo Diffusion XL',
    apiVersion: 'v1',
    description: 'High detail, artistic'
  },
  '291be633-cb24-434f-898f-e662799936ad': {
    name: 'Leonardo Kino XL',
    apiVersion: 'v1',
    description: 'Cinematic, poster-style'
  },
  '05ce0082-2d80-4a2d-8653-4d1c85e2418e': {
    name: 'Leonardo Kino 2.0',
    apiVersion: 'v1',
    description: 'Latest V1 model, best poster quality'
  },
  '6b645e3a-d64f-4341-a6d8-7a3690fbf042': {
    name: 'Leonardo Vision XL',
    apiVersion: 'v1',
    description: 'Photorealistic images'
  },
  'aa77f04e-3eec-4034-9c07-d0f619684628': {
    name: 'AlbedoBase XL',
    apiVersion: 'v1',
    description: 'Versatile, general purpose'
  },

  // V2 Models (String-based, Gemini models)
  'gemini-image-1': {
    name: 'Nano Banana',
    apiVersion: 'v2',
    description: 'Gemini 2.5 Flash Image'
  },
  'gemini-image-2': {
    name: 'Nano Banana Pro',
    apiVersion: 'v2',
    description: 'Gemini 3 Pro Image, supports reference images and styles'
  }
};

/**
 * Leonardo.ai image generation provider
 * Wraps Leonardo.ai API calls for image generation
 * Supports both V1 (UUID-based diffusion models) and V2 (Gemini-based models)
 */
class LeonardoProvider {
  constructor() {
    // Default to Leonardo Kino 2.0 for best poster-style artwork
    this.model = process.env.LEONARDO_MODEL_ID || '05ce0082-2d80-4a2d-8653-4d1c85e2418e';

    // Valid scheduler options for V1 models:
    // - LEONARDO (recommended - Leonardo's default, balanced)
    // - EULER_DISCRETE (fast, good quality)
    // - EULER_ANCESTRAL_DISCRETE (more creative/varied)
    // - DPM_SOLVER (high quality, slower)
    // - KLMS (Karras, high detail)
    // - DDIM (deterministic, consistent)
    // - PNDM (pseudo numerical methods)
    // Note: V2 models don't use schedulers
    this.scheduler = process.env.LEONARDO_SCHEDULER || 'LEONARDO';

    // Validate model on initialization
    this.validateModel();

    if (!leonardo) {
      throw new Error('Leonardo.ai SDK not initialized. Please set LEONARDO_API_KEY environment variable.');
    }
  }

  /**
   * Validate that the configured model is supported
   * @throws {Error} If model ID is not in the registry
   */
  validateModel() {
    if (!LEONARDO_MODELS[this.model]) {
      const validModels = Object.keys(LEONARDO_MODELS).join(', ');
      throw new Error(
        `Invalid Leonardo model ID: "${this.model}". ` +
        `Valid models: ${validModels}`
      );
    }
  }

  /**
   * Get the API version for the current model
   * @returns {string} 'v1' or 'v2'
   */
  getApiVersion() {
    return LEONARDO_MODELS[this.model].apiVersion;
  }

  /**
   * Get model information
   * @returns {Object} Model configuration with name, apiVersion, and description
   */
  getModelInfo() {
    return LEONARDO_MODELS[this.model];
  }

  /**
   * Generate a raw image using Leonardo.ai API
   * Routes to V1 or V2 implementation based on model type
   * @param {string} prompt - The prompt for image generation
   * @returns {Promise<string>} Temporary image URL from Leonardo.ai
   */
  async generateRawImage(prompt) {
    const apiVersion = this.getApiVersion();
    const modelInfo = this.getModelInfo();

    console.log(`🎨 Using model: ${this.model} (${modelInfo.name})`);
    console.log(`🎨 API Version: ${apiVersion}`);

    return apiVersion === 'v2'
      ? this.generateV2(prompt)
      : this.generateV1(prompt);
  }

  /**
   * Generate image using V1 API (UUID-based diffusion models)
   * @param {string} prompt - The prompt for image generation
   * @returns {Promise<string>} Temporary image URL from Leonardo.ai
   */
  async generateV1(prompt) {
    try {
      console.log('🎨 Leonardo SDK instance:', !!leonardo);
      console.log('🎨 Leonardo API configured:', !!leonardo?.image);
      console.log('🎨 Using scheduler:', this.scheduler);

      const requestParams = {
        prompt: prompt,
        modelId: this.model,
        width: 1024,
        height: 1024,
        numImages: 1,  // Try camelCase as well
        num_images: 1,  // Keep snake_case for compatibility
        guidance_scale: 7,
        num_inference_steps: 20,
        alchemy: false,  // Disable Alchemy for Kino 2.0 compatibility
        scheduler: this.scheduler  // Configurable scheduler
      };

      console.log('🎨 V1 Request parameters:', JSON.stringify(requestParams, null, 2));

      // Create generation job using the SDK
      const generation = await leonardo.image.createGeneration(requestParams);

      // The SDK wraps the response in an 'object' property
      const jobData = generation?.object?.sdGenerationJob || generation?.sdGenerationJob;

      if (!jobData?.generationId) {
        console.error('Unexpected generation response structure:', JSON.stringify(generation, null, 2));
        throw new Error('No generation ID in Leonardo.ai response');
      }

      const generationId = jobData.generationId;

      // Poll for completion
      const imageUrl = await this.pollForCompletion(generationId);

      return imageUrl;
    } catch (error) {
      console.error('Leonardo.ai V1 API error:', error);
      throw new Error(`Leonardo.ai V1 generation failed: ${error.message}`);
    }
  }

  /**
   * Generate image using V2 API (Gemini-based models like Nano Banana Pro)
   * @param {string} prompt - The prompt for image generation
   * @returns {Promise<string>} Temporary image URL from Leonardo.ai
   */
  async generateV2(prompt) {
    try {
      console.log('🎨 Using V2 API for Gemini-based model');

      const payload = {
        model: this.model,
        parameters: {
          width: 1024,
          height: 1024,
          prompt: prompt,
          quantity: 1,
          prompt_enhance: "OFF"
        },
        public: false
      };

      console.log('🎨 V2 Request parameters:', JSON.stringify(payload, null, 2));

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

      console.log('🎨 V2 Response received');

      // Extract generation ID from response
      // Try multiple possible response structures
      const jobData = response.data?.sdGenerationJob ||
                     response.data?.object?.sdGenerationJob ||
                     response.data;

      const generationId = jobData?.generationId ||
                          jobData?.id ||
                          response.data?.generationId ||
                          response.data?.id;

      if (!generationId) {
        console.error('Unexpected V2 generation response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('No generation ID in Leonardo.ai V2 response');
      }

      console.log(`🎨 V2 Generation ID: ${generationId}`);

      // Poll for completion using V1 endpoint (same for both V1 and V2)
      const imageUrl = await this.pollForCompletion(generationId);

      return imageUrl;
    } catch (error) {
      console.error('Leonardo.ai V2 API error:', error);
      if (error.response) {
        console.error('V2 API Response status:', error.response.status);
        console.error('V2 API Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw new Error(`Leonardo.ai V2 generation failed: ${error.message}`);
    }
  }

  /**
   * Poll Leonardo.ai API for generation completion
   * @param {string} generationId - The generation ID to poll
   * @returns {Promise<string>} Image URL when generation is complete
   */
  async pollForCompletion(generationId, maxAttempts = 60, intervalMs = 3000) {
    console.log(`🔄 Starting to poll generation ${generationId} (max ${maxAttempts} attempts, ${intervalMs}ms interval)`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`\n🔄 Poll attempt ${attempt}/${maxAttempts} for generation ID: ${generationId}`);
        console.log('   Fetching generation status...');
        
        let generation;
        try {
          generation = await leonardo.image.getGenerationById(generationId);
        } catch (sdkError) {
          // SDK may throw validation errors for newer models like KINO_2_0
          // If it's a response validation error, try to extract data anyway
          if (sdkError.message?.includes('Response validation failed') || 
              sdkError.message?.includes('invalid_enum_value')) {
            console.warn(`⚠️ SDK validation error (expected for KINO_2_0), attempting to use raw response...`);
            
            // The SDK error should contain the raw response data
            // Try to make a direct API call instead
            const axios = require('axios');
            const response = await axios.get(
              `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
              {
                headers: {
                  'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
                  'Accept': 'application/json'
                }
              }
            );
            generation = { object: response.data };
            console.log('✓ Retrieved data via direct API call');
          } else {
            throw sdkError;
          }
        }
        
        // Debug: log the response structure
        console.log('🔍 Response status available');
        
        // The SDK wraps the response in an 'object' property
        // Try both camelCase and snake_case since Leonardo API returns camelCase
        const generationData = generation?.object?.generationsByPk || 
                               generation?.object?.generations_by_pk || 
                               generation?.generationsByPk ||
                               generation?.generations_by_pk ||
                               generation?.object; // Direct API response
        
        if (!generationData) {
          console.error('❌ No generation data found in response!');
          console.error('Response keys:', Object.keys(generation || {}));
          if (generation?.object) {
            console.error('Object keys:', Object.keys(generation.object || {}));
          }
        } else {
          console.log('✓ Generation data found');
        }
        
        const status = generationData?.status || 'UNKNOWN';
        console.log(`📊 Status: ${status}`);
        
        if (status === 'PENDING') {
          console.log(`⏳ Still pending, waiting ${intervalMs}ms before next check...`);
        }
        
        if (generationData?.status === 'COMPLETE') {
          // Try both camelCase and snake_case for images
          const images = generationData.generatedImages || 
                        generationData.generated_images ||
                        generationData.generated_image_variation_generics;
          console.log(`   ✅ Generation complete! Found ${images?.length || 0} images`);
          if (images && images.length > 0 && images[0].url) {
            console.log(`   📸 Image URL: ${images[0].url}`);
            return images[0].url;
          }
          throw new Error('Generation completed but no image URL found');
        }
        
        if (generationData?.status === 'FAILED') {
          console.error('   ❌ Generation failed!');
          throw new Error('Leonardo.ai generation failed');
        }
        
        // Still processing, wait and try again
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
      } catch (error) {
        if (attempt === maxAttempts) {
          console.error(`❌ Polling failed after ${maxAttempts} attempts (${maxAttempts * intervalMs / 1000}s total)`);
          throw error;
        }
        console.warn(`⚠️ Leonardo.ai polling attempt ${attempt} error:`, error.message);
        console.warn(`   Retrying in ${intervalMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }
    
    throw new Error(`Leonardo.ai generation timed out after ${maxAttempts * intervalMs / 1000} seconds`);
  }

  /**
   * Get provider name for logging purposes
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'Leonardo.ai';
  }
}

module.exports = LeonardoProvider;
