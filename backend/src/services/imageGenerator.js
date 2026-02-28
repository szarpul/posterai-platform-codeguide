const ImageGeneratorFactory = require('./imageGeneration/ImageGeneratorFactory');
const axios = require('axios');
const supabase = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

class ImageGeneratorService {
  static buildPrompt(options) {
    // Support both old format (theme, palette, style, emotion) and new format (artStyle, colorPalette, subject)
    const { 
      // New 3-step format
      artStyle, 
      colorPalette, 
      subject,
      // Old format (for backward compatibility)
      theme, 
      palette, 
      style, 
      emotion, 
      inspirationKeyword 
    } = options;

    // Use new format if provided, otherwise fall back to old format
    if (artStyle && colorPalette && subject) {
      return this.buildPromptNewFormat({ artStyle, colorPalette, subject });
    } else if (theme && palette && style && emotion) {
      return this.buildPromptOldFormat({ theme, palette, style, emotion, inspirationKeyword });
    } else {
      throw new Error('Invalid options: must provide either (artStyle, colorPalette, subject) or (theme, palette, style, emotion)');
    }
  }

  static buildPromptNewFormat({ artStyle, colorPalette, subject }) {
    // Art Style mappings for 4-style visual questionnaire
    const artStyleMappings = {
      'painterly_minimalism': 'painterly minimalism, simple forms, clean lines, strong use of negative space, calm compositions, minimal silhouettes, sparse and serene aesthetic',
      'organic_abstraction': 'organic abstraction, flowing shapes, natural forms, soft curves, harmonious colors, organic forms inspired by nature, biomorphic shapes',
      'contemporary_impressionism': 'contemporary impressionism, painterly brushstrokes, light and shadow interplay, atmospheric scenes, vivid color impressions, loose expressive technique',
      'mid_century_modern': 'mid-century modern style, vintage travel poster aesthetic, atomic-age graphics, retro 1950s-1960s design, bold flat shapes, nostalgic illustration'
    };

    // Color Palette mappings
    const colorPaletteMappings = {
      'monochrome': 'monochrome palette — black, white, shades of grey',
      'earth_tones': 'earth tones — warm browns, terracotta, ochre, sage green',
      'ocean_blues': 'ocean blues — deep blue, turquoise, aqua, seafoam',
      'warm_sunset': 'warm sunset colors — coral, peach, golden yellow, warm orange',
      'forest_greens': 'forest greens — deep green, emerald, moss, olive',
      'vibrant_bold': 'vibrant bold colors — bright red, electric blue, vivid purple, high saturation',
      'pastels': 'pastel colors — soft pink, lavender, mint, peach, light blue'
    };

    // Subject mappings (dynamic based on art style)
    const subjectMappings = {
      'painterly_minimalism': {
        'landscape_horizon': 'minimal landscape with a serene horizon line, vast sky, calm simplicity',
        'silhouette': 'minimal silhouette, single figure or object reduced to essential form, strong contrast',
        'abstract_form': 'abstract geometric or organic form, minimal composition, balanced negative space'
      },
      'organic_abstraction': {
        'landscape_emotion': 'abstract landscape evoking emotion, flowing terrain forms, expressive natural shapes',
        'organic_form': 'organic abstract form, biomorphic shapes, flowing natural curves, nature-inspired abstraction',
        'deconstructed_portrait': 'deconstructed portrait, abstract facial features, flowing organic lines, expressive and fluid'
      },
      'contemporary_impressionism': {
        'landscape': 'impressionist landscape, scenic vista, atmospheric depth, painterly sky and terrain',
        'nature': 'impressionist nature scene, flowers, trees, or garden, dappled light, lush color',
        'architecture': 'impressionist architectural scene, buildings or streetscape, light reflections, urban atmosphere'
      },
      'mid_century_modern': {
        'travel_poster': 'vintage travel poster, classic destination illustration, bold typography area, retro tourism art',
        'atomic_age_graphics': 'atomic-age graphics, starburst patterns, boomerang shapes, space-age optimism, 1950s futurism',
        'geometric_patterns': 'mid-century geometric patterns, repeating shapes, bold color blocks, retro textile-inspired design'
      }
    };

    // Get mappings
    const artStyleDescription = artStyleMappings[artStyle] || artStyle;
    const colorPaletteDescription = colorPaletteMappings[colorPalette] || colorPalette;
    const subjectDescription = subjectMappings[artStyle]?.[subject] || subject;

    // Build prompt for art poster for home decor
    const prompt = `
IMPORTANT: Create ONLY the poster artwork itself, not a mockup or room scene.

High-quality poster artwork, print-ready, full-bleed design for home decor.

Subject: ${subjectDescription}
Art Style: ${artStyleDescription}
Color Palette: ${colorPaletteDescription}

Composition: edge-to-edge (full-bleed), strong focal point, balanced negative space
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

  static buildPromptOldFormat({ theme, palette, style, emotion, inspirationKeyword }) {
    // Old format mappings (for backward compatibility)
    const styleMappings = {
      'realistic': 'photorealistic, fine texture and detail, lifelike lighting',
      'cartoon': 'cartoon illustration, bold shapes, clean lines, vibrant colors',
      'surreal': 'surreal and dreamlike, unexpected elements, ethereal atmosphere',
      'minimalist': 'minimalist composition, large simple shapes, strong use of negative space',
      'flat_vector': 'flat vector art, geometric forms, solid colors, high contrast',
      'vintage_retro': 'vintage aesthetic, retro style, subtle texture and grain'
    };

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

    const paletteMappings = {
      'bright': 'bright colors — ivory, soft yellow, sky blue',
      'dark': 'dark tones — charcoal, deep navy, burgundy',
      'pastel': 'pastel hues — blush pink, mint green, lavender',
      'neutral': 'neutral palette — warm grey, sand, cream'
    };

    const themeSubjects = {
      'nature': 'natural landscape or organic elements',
      'urban': 'urban architecture or city scene',
      'fantasy': 'fantastical or magical imagery',
      'futuristic': 'futuristic or sci-fi themed visual'
    };

    const styleFragment = styleMappings[style] || style;
    const emotionData = emotionMappings[emotion] || { mood: emotion, lighting: 'natural lighting' };
    const paletteFragment = paletteMappings[palette] || palette;
    const subjectFragment = themeSubjects[theme] || theme;
    
    const inspirationFragment = inspirationKeyword 
      ? `, inspired by the concept of "${inspirationKeyword}"`
      : '';

    const prompt = `
IMPORTANT: Create ONLY the poster artwork itself, not a mockup or room scene.

High-quality poster artwork, print-ready, full-bleed design.

Subject: ${subjectFragment}${inspirationFragment}
Style: ${styleFragment}
Mood: ${emotionData.mood}
Colors: ${paletteFragment}
Lighting: ${emotionData.lighting}

Composition: edge-to-edge (full-bleed), strong focal point, balanced negative space
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