const leonardo = require('../../lib/leonardo');

/**
 * Leonardo.ai image generation provider
 * Wraps Leonardo.ai API calls for image generation
 */
class LeonardoProvider {
  constructor() {
    // Available Leonardo Models:
    // - b24e16ff-06e3-43eb-8d33-4416c2d75876 : Leonardo Phoenix (fast, good quality)
    // - 1e60896f-3c26-4296-8ecc-53e2afecc132 : Leonardo Diffusion XL (high detail)
    // - 291be633-cb24-434f-898f-e662799936ad : Leonardo Kino XL (cinematic)
    // - 6b645e3a-d64f-4341-a6d8-7a3690fbf042 : Leonardo Vision XL (photorealistic)
    // - aa77f04e-3eec-4034-9c07-d0f619684628 : AlbedoBase XL (versatile)
    
    // Default to Leonardo Kino XL for better poster-style artwork
    this.model = process.env.LEONARDO_MODEL_ID || '291be633-cb24-434f-898f-e662799936ad';
    
    if (!leonardo) {
      throw new Error('Leonardo.ai SDK not initialized. Please set LEONARDO_API_KEY environment variable.');
    }
  }

  /**
   * Generate a raw image using Leonardo.ai API
   * @param {string} prompt - The prompt for image generation
   * @returns {Promise<string>} Temporary image URL from Leonardo.ai
   */
  async generateRawImage(prompt) {
    try {
      console.log('🎨 Leonardo SDK instance:', !!leonardo);
      console.log('🎨 Leonardo API configured:', !!leonardo?.image);
      console.log('🎨 Using model:', this.model);
      
      const requestParams = {
        prompt: prompt,
        modelId: this.model,
        width: 1024,
        height: 1024,
        numImages: 1,  // Try camelCase as well
        num_images: 1,  // Keep snake_case for compatibility
        guidance_scale: 7,
        num_inference_steps: 20
      };
      
      console.log('🎨 Request parameters:', JSON.stringify(requestParams, null, 2));
      
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
      console.error('Leonardo.ai API error:', error);
      throw new Error(`Leonardo.ai generation failed: ${error.message}`);
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
        const generation = await leonardo.image.getGenerationById(generationId);
        
        // Debug: ALWAYS log the response structure to see what we're getting
        console.log('🔍 Full response:', JSON.stringify(generation, null, 2));
        
        // The SDK wraps the response in an 'object' property
        // Try both camelCase and snake_case since Leonardo API returns camelCase
        const generationData = generation?.object?.generationsByPk || 
                               generation?.object?.generations_by_pk || 
                               generation?.generationsByPk ||
                               generation?.generations_by_pk;
        
        if (!generationData) {
          console.error('❌ No generation data found in response!');
          console.error('Response keys:', Object.keys(generation || {}));
          if (generation?.object) {
            console.error('Object keys:', Object.keys(generation.object || {}));
          }
        } else {
          console.log('✓ Generation data found');
          console.log('  Keys in generationData:', Object.keys(generationData));
        }
        
        const status = generationData?.status || 'UNKNOWN';
        console.log(`📊 Status: ${status}`);
        
        if (status === 'PENDING') {
          console.log(`⏳ Still pending, waiting ${intervalMs}ms before next check...`);
        }
        
        if (generationData?.status === 'COMPLETE') {
          // Try both camelCase and snake_case for images
          const images = generationData.generatedImages || generationData.generated_images;
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
