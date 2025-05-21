const openai = require('../lib/openai');
const features = require('../config/features');
const StubImageGeneratorService = require('./stubImageGenerator');
const axios = require('axios');
const { supabase } = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

class ImageGeneratorService {
  static buildPrompt(options) {
    const { style, theme, mood, colorPalette, subject } = options;
    
    // Build a more detailed prompt for better image quality
    return `Create a high-quality, professional poster design with the following characteristics:
    
    Style: ${style} design language with clean compositions and balanced elements.
    Theme: ${theme} incorporating relevant visual elements and symbolism.
    Mood: A ${mood} atmosphere that evokes corresponding emotional responses.
    Colors: Use a ${colorPalette} color palette that works harmoniously together.
    Subject: ${subject} as the main focal point of the composition.
    
    The poster should have a clean look suitable for high-quality printing at large sizes.
    Avoid any text or words in the image. Focus on creating a striking visual composition.
    Make the image clearly readable from a distance with good contrast.
    Ensure the design has enough margin space around the edges for printing.`;
  }

  static async generateWithRetry(options, maxRetries = 3) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = this.buildPrompt(options); // Restore dynamic prompt
        
        console.log(`Attempt ${attempt}: Generating image with OpenAI`);
        console.log('Using prompt:', prompt);
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",    // Restore quality
          style: "natural",       // Restore style
          response_format: "url"  // Restore response_format
        });
        
        if (!response.data?.[0]?.url) {
          console.error('OpenAI response data:', JSON.stringify(response.data, null, 2));
          throw new Error('No image URL in response');
        }
        
        return { 
          imageUrl: response.data[0].url,
          prompt 
        };
      } catch (error) {
        lastError = error;
        console.error('OpenAI API error:', error);
        
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
      // Use stubbed implementation if feature flag is enabled
      if (features.useStubImageGeneration) {
        console.log('Using stubbed image generation');
        return StubImageGeneratorService.generateImage(options);
      }

      // Use real OpenAI implementation with retries
      const { imageUrl, prompt } = await this.generateWithRetry(options);
      
      try {
        // Download image from OpenAI (temporary URL)
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
        // If storage fails, return the original OpenAI URL
        // The URL is temporary but at least the user can see something
        console.warn('Falling back to original OpenAI URL (temporary)');
        return { imageUrl, prompt };
      }
    } catch (error) {
      console.error('Image generation error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}

module.exports = ImageGeneratorService; 