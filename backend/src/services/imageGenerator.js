const ImageGeneratorFactory = require('./imageGeneration/ImageGeneratorFactory');
const axios = require('axios');
const supabase = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

class ImageGeneratorService {
  static buildPrompt(options) {
    const { theme, palette, style, emotion, inspirationKeyword } = options;
    
    // Style mappings (expanded to replace mainElement)
    const styleMappings = {
      'realistic': 'photorealistic, fine texture and detail, lifelike lighting',
      'cartoon': 'cartoon illustration, bold shapes, clean lines, vibrant colors',
      'surreal': 'surreal and dreamlike, unexpected elements, ethereal atmosphere',
      'minimalist': 'minimalist composition, large simple shapes, strong use of negative space',
      'flat_vector': 'flat vector art, geometric forms, solid colors, high contrast',
      'vintage_retro': 'vintage aesthetic, retro style, subtle texture and grain'
    };

    // Emotion mappings with lighting
    const emotionMappings = {
      'calm': {
        mood: 'calm and serene',
        lighting: 'soft diffused light, gentle ambiance'
      },
      'energetic': {
        mood: 'energetic and dynamic',
        lighting: 'vibrant lighting, strong contrast'
      },
      'nostalgic': {
        mood: 'warm and nostalgic',
        lighting: 'golden warm glow, soft vintage feel'
      },
      'inspirational': {
        mood: 'uplifting and awe-inspiring',
        lighting: 'dramatic lighting, expansive atmosphere'
      }
    };

    // Palette mappings
    const paletteMappings = {
      'bright': 'bright colors — ivory, soft yellow, sky blue',
      'dark': 'dark tones — charcoal, deep navy, burgundy',
      'pastel': 'pastel hues — blush pink, mint green, lavender',
      'neutral': 'neutral palette — warm grey, sand, cream'
    };

    // Theme as subject
    const themeSubjects = {
      'nature': 'natural landscape or organic elements',
      'urban': 'urban architecture or city scene',
      'fantasy': 'fantastical or magical imagery',
      'futuristic': 'futuristic or sci-fi themed visual'
    };

    // Build prompt fragments
    const styleFragment = styleMappings[style] || style;
    const emotionData = emotionMappings[emotion] || { mood: emotion, lighting: 'natural lighting' };
    const paletteFragment = paletteMappings[palette] || palette;
    const subjectFragment = themeSubjects[theme] || theme;
    
    const inspirationFragment = inspirationKeyword 
      ? `, inspired by the concept of "${inspirationKeyword}"`
      : '';

    // Simplified prompt - describe what TO create
    const prompt = `
Create ${subjectFragment}${inspirationFragment}.

Style: ${styleFragment}
Mood: ${emotionData.mood}
Colors: ${paletteFragment}
Lighting: ${emotionData.lighting}

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges.
`.trim();

    return prompt;
  }

  static async generateWithRetry(options, maxRetries = 3) {
    let lastError = null;
    let provider = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = this.buildPrompt(options);
        provider = ImageGeneratorFactory.getDefaultProvider();
        
        console.log(`Attempt ${attempt}: Generating image with ${provider.getProviderName()}`);
        console.log('Using prompt:', prompt);
        
        const imageUrl = await provider.generateRawImage(prompt);
        
        return { 
          imageUrl,
          prompt 
        };
      } catch (error) {
        lastError = error;
        const providerName = provider ? provider.getProviderName() : 'Unknown Provider';
        console.error(`${providerName} API error:`, error);
        
        const isRateLimitError = error.message?.includes('rate limit') || error.status === 429;
        const isServerError = error.status >= 500 && error.status < 600;
        
        if (isRateLimitError || isServerError) {
          const delay = Math.floor(1000 * Math.pow(2, attempt) + Math.random() * 1000);
          console.warn(`API error (${error.message}). Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          throw error;
        }
      }
    }
    
    throw lastError || new Error('Failed to generate image after multiple attempts');
  }

  static async generateImage(options) {
    try {
      // Use real implementation with retries
      const { imageUrl, prompt } = await this.generateWithRetry(options);
      
      try {
        // Download image from provider (temporary URL)
        const imageResponse = await axios.get(imageUrl, { 
          responseType: 'arraybuffer',
          timeout: 10000 // 10s timeout
        });
        
        const buffer = Buffer.from(imageResponse.data, 'binary');
        
        // Generate a unique file name
        const fileName = `poster-${uuidv4()}.png`;
        const filePath = `generated-images/${fileName}`;
        
        // Upload to Supabase Storage
        const { error } = await supabase
          .storage
          .from('posters')
          .upload(filePath, buffer, {
            contentType: 'image/png',
            upsert: false
          });
          
        if (error) throw error;
        
        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase
          .storage
          .from('posters')
          .getPublicUrl(filePath);
        
        return {
          imageUrl: publicUrl,
          prompt
        };
      } catch (storageError) {
        console.error('Storage error:', storageError);
        // If storage fails, return the original provider URL
        // The URL is temporary but at least the user can see something
        console.warn('Falling back to original provider URL (temporary)');
        return { imageUrl, prompt };
      }
    } catch (error) {
      console.error('Image generation error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}

module.exports = ImageGeneratorService; 