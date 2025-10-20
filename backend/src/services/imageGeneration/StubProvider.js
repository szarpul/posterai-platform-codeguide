/**
 * Stub image generation provider
 * Returns placeholder images for testing
 */
class StubProvider {
  /**
   * Generate a stub image URL
   * @param {string} prompt - The prompt for image generation (ignored)
   * @returns {Promise<string>} Placeholder image URL
   */
  async generateRawImage(prompt) {
    // Return a placeholder image URL for testing
    const placeholderUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`;
    
    console.log('Using stub image generation with prompt:', prompt);
    
    return placeholderUrl;
  }

  /**
   * Get provider name for logging purposes
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'Stub';
  }
}

module.exports = StubProvider;
