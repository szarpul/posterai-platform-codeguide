const ImageGeneratorFactory = require('./imageGeneration/ImageGeneratorFactory');
const axios = require('axios');
const supabase = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

class ImageGeneratorService {
  static buildPrompt(options) {
    const { palette, style, mainElement, occasion, emotion, inspirationKeyword } = options;
    
    // Style mappings
    const styleMappings = {
      'realistic': 'photorealistic illustration, fine texture, lifelike lighting',
      'cartoon': 'clean cartoon, bold shapes, flat shading, thick outlines',
      'surreal': 'surreal, dreamlike, unexpected juxtaposition, ethereal',
      'minimalist': 'minimalist poster, large shapes, limited palette, strong negative space',
      'flat_vector': 'flat vector style, geometric forms, solid fills, high contrast',
      'vintage_retro': 'vintage poster, subtle film grain, retro vibe'
    };

    // Emotion mappings with lighting
    const emotionMappings = {
      'calm': {
        mood: 'calm, serene mood',
        lighting: 'soft diffuse light, pastel ambiance'
      },
      'energetic': {
        mood: 'energetic, dynamic mood',
        lighting: 'high contrast light, directional highlights'
      },
      'nostalgic': {
        mood: 'nostalgic, warm mood',
        lighting: 'golden hour glow, slight film grain'
      },
      'inspirational': {
        mood: 'uplifting, awe-inspiring mood',
        lighting: 'dramatic rim light, airy atmosphere'
      }
    };

    // Palette mappings
    const paletteMappings = {
      'bright': 'bright palette — ivory, soft yellow, sky blue',
      'dark': 'dark palette — charcoal, deep navy, burgundy',
      'pastel': 'pastel palette — blush pink, mint, lavender',
      'neutral': 'neutral palette — warm grey, sand, off-white'
    };

    // Main element mappings
    const mainElementMappings = {
      'photo_realistic': 'photo-centric composition, clear subject in foreground',
      'illustration_drawing': 'illustration-centric, iconic silhouette',
      'abstract_shapes': 'abstract geometric centerpiece, bold forms'
    };

    // Occasion mappings
    const occasionMappings = {
      'home_decoration': 'designed for a stylish home interior, modern decor',
      'office_workspace': 'professional, motivational poster for office walls',
      'kids_room': 'playful, child-friendly atmosphere, warm and inviting',
      'gift_special_event': 'designed as a thoughtful, personal gift poster'
    };

    // Build prompt fragments
    const styleFragment = styleMappings[style] || style;
    const emotionData = emotionMappings[emotion] || { mood: emotion, lighting: 'natural lighting' };
    const emotionFragment = emotionData.mood;
    const lightingFragment = emotionData.lighting;
    const paletteFragment = paletteMappings[palette] || palette;
    const mainElementFragment = mainElementMappings[mainElement] || mainElement;
    const occasionFragment = occasionMappings[occasion] || occasion;
    const subjectFragment = inspirationKeyword
      ? `inspired by "${inspirationKeyword}"`
      : 'creative composition';

    // Build final prompt using the template
    const prompt = `
          IMPORTANT: Create ONLY the poster artwork itself, not a mockup or room scene.
          
          High-quality poster artwork, print-ready, full-bleed design.
          
          Occasion: ${occasionFragment}
          Subject: ${subjectFragment} — artwork only, not a photo
          Primary style: ${styleFragment}
          Emotion/mood: ${emotionFragment}
          Color palette: ${paletteFragment}
          Composition: ${mainElementFragment}, edge-to-edge (full-bleed), strong focal point, balanced negative space
          Lighting: ${lightingFragment}
          Detail level: crisp details, smooth gradients, no noise, no blur
          Quality intents: ultra sharp, print-grade, vector-like edges, consistent style
          
          STRICT CONSTRAINTS: 
          - Create the poster artwork ONLY, not displayed on a wall or in a room
          - No frame, no border, no mat, no wall background
          - No mockup, no interior scene, no perspective view, no room setting
          - No hands holding it, no furniture, no environment
          - No watermark, no UI, no text, no captions, no extra logos
          - Flat, direct view of the artwork itself as if viewing the print file
          
          Camera/Render: straight-on orthographic view, tightly cropped to artwork edges only
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