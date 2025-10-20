const openai = require('../../lib/openai');

/**
 * OpenAI image generation provider
 * Wraps OpenAI API calls for image generation
 */
class OpenAIProvider {
  /**
   * Generate a raw image using OpenAI API
   * @param {string} prompt - The prompt for image generation
   * @returns {Promise<string>} Temporary image URL from OpenAI
   */
  async generateRawImage(prompt) {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
      response_format: "url"
    });
    
    if (!response.data?.[0]?.url) {
      throw new Error('No image URL in OpenAI response');
    }
    
    return response.data[0].url;
  }

  /**
   * Get provider name for logging purposes
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'OpenAI';
  }
}

module.exports = OpenAIProvider;
