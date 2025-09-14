const StubImageGeneratorService = {
  generateImage(options) {
    const { theme, palette, style, mainElement, occasion, emotion, inspirationKeyword } = options;
    
    // Build a simple prompt for testing
    const prompt = `Create a ${style} poster design with ${theme} theme.
Emotion: A ${emotion} atmosphere that evokes corresponding emotional responses.
Colors: Use a ${palette} color palette that works harmoniously together.
Main element: ${mainElement} as the primary visual focus.
Occasion: ${occasion}.
${inspirationKeyword ? `Inspiration: ${inspirationKeyword}` : ''}

The poster should have a clean look suitable for high-quality printing at large sizes.
Avoid any text or words in the image. Focus on creating a striking visual composition.`;

    // Return a placeholder image URL for testing
    const placeholderUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`;
    
    return {
      imageUrl: placeholderUrl,
      prompt: prompt
    };
  }
};

module.exports = StubImageGeneratorService; 