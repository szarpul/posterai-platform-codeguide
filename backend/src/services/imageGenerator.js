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
    // Art Style mappings for new 3-step visual questionnaire
    const artStyleMappings = {
      'abstract_geometric': 'abstract geometric composition, clean lines, geometric patterns, modern design',
      'minimalist': 'minimalist design, simple forms, strong use of negative space, clean aesthetic',
      'botanical': 'botanical art, organic forms, plant-based imagery, natural elements',
      'landscape': 'landscape art, scenic views, natural environments, atmospheric perspective',
      'surreal': 'surreal art, dreamlike imagery, unexpected combinations, ethereal atmosphere',
      'retro_vintage': 'retro vintage style, mid-century modern aesthetic, nostalgic design, classic poster art',
      'cosmic_space': 'cosmic space art, celestial imagery, nebulas, galaxies, astronomical themes'
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
      'abstract_geometric': {
        'organic_shapes': 'organic shapes, flowing forms, natural curves',
        'geometric_patterns': 'geometric patterns, repeating shapes, structured design',
        'fluid_forms': 'fluid forms, dynamic movement, abstract composition'
      },
      'minimalist': {
        'lines': 'simple lines, linear elements, geometric lines',
        'shapes': 'basic shapes, geometric forms, simple compositions',
        'negative_space': 'strong negative space, balanced composition, clean design',
        'simple_forms': 'simple forms, reduced elements, essential shapes'
      },
      'botanical': {
        'flowers': 'flowers, floral elements, botanical illustrations',
        'leaves': 'leaves, foliage, plant details, natural textures',
        'trees': 'trees, branches, natural growth patterns',
        'abstract_plants': 'abstract plant forms, stylized botanical elements'
      },
      'landscape': {
        'mountains': 'mountain landscapes, peaks, scenic vistas',
        'ocean': 'ocean scenes, seascapes, coastal views',
        'forest': 'forest scenes, woodland, natural environments',
        'desert': 'desert landscapes, arid scenes, vast horizons'
      },
      'surreal': {
        'dreamscapes': 'dreamlike landscapes, surreal environments, fantastical scenes',
        'abstract_forms': 'abstract forms, non-representational elements, conceptual imagery',
        'unexpected_combinations': 'unexpected combinations, juxtaposed elements, surreal compositions'
      },
      'retro_vintage': {
        'travel_poster': 'travel poster style, vintage tourism, classic destinations',
        'mid_century_modern': 'mid-century modern design, retro aesthetic, 1950s-60s style',
        'psychedelic': 'psychedelic art, vibrant patterns, 1960s-70s aesthetic'
      },
      'cosmic_space': {
        'planets': 'planets, celestial bodies, astronomical objects',
        'nebulas': 'nebulas, cosmic clouds, stellar formations',
        'stars': 'stars, starfields, celestial patterns',
        'galaxies': 'galaxies, spiral formations, cosmic structures'
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