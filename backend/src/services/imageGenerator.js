const openai = require('../lib/openai');
const features = require('../config/features');
const StubImageGeneratorService = require('./stubImageGenerator');

class ImageGeneratorService {
  static buildPrompt(options) {
    const { style, theme, mood, colorPalette, subject } = options;
    return `Create a ${style} poster with a ${theme} theme. 
    The mood should be ${mood} and use a ${colorPalette} color palette. 
    The main subject is ${subject}. 
    Make it suitable for high-quality printing.`;
  }

  static async generateImage(options) {
    try {
      // Use stubbed implementation if feature flag is enabled
      if (features.useStubImageGeneration) {
        console.log('Using stubbed image generation');
        return StubImageGeneratorService.generateImage(options);
      }

      // Use real OpenAI implementation
      const prompt = this.buildPrompt(options);
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        response_format: "url"
      });

      return {
        imageUrl: response.data[0].url,
        prompt
      };
    } catch (error) {
      console.error('Image generation error:', error);
      throw new Error('Failed to generate image');
    }
  }
}

module.exports = ImageGeneratorService; 