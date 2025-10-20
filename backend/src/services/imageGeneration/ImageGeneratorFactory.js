const OpenAIProvider = require('./OpenAIProvider');
const LeonardoProvider = require('./LeonardoProvider');
const StubProvider = require('./StubProvider');

/**
 * Factory class for creating image generation providers
 * Uses factory pattern to instantiate the correct provider based on configuration
 */
class ImageGeneratorFactory {
  /**
   * Create an image generation provider instance based on the specified type
   * @param {string} providerType - Type of provider ('openai', 'leonardo', 'stub')
   * @returns {Object} Instance of the specified image generation provider
   * @throws {Error} If provider type is not supported
   */
  static createProvider(providerType = 'openai') {
    switch (providerType.toLowerCase()) {
      case 'openai':
        return new OpenAIProvider();
      case 'leonardo':
        return new LeonardoProvider();
      case 'stub':
        return new StubProvider();
      default:
        throw new Error(`Unsupported image generation provider: ${providerType}`);
    }
  }

  /**
   * Get the default image generation provider based on environment configuration
   * @returns {Object} Instance of the default image generation provider
   */
  static getDefaultProvider() {
    const providerType = process.env.IMAGE_GENERATION_PROVIDER || 'openai';
    console.log(`🎨 Using image generation provider: ${providerType}`);
    return this.createProvider(providerType);
  }

  /**
   * Get list of available image generation providers
   * @returns {string[]} Array of supported provider names
   */
  static getAvailableProviders() {
    return ['openai', 'leonardo', 'stub'];
  }

  /**
   * Check if a provider type is supported
   * @param {string} providerType - Provider type to check
   * @returns {boolean} True if provider is supported
   */
  static isProviderSupported(providerType) {
    return this.getAvailableProviders().includes(providerType.toLowerCase());
  }
}

module.exports = ImageGeneratorFactory;
