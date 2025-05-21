class StubImageGeneratorService {
  static buildPrompt(options) {
    const { style, theme, mood, colorPalette, subject } = options;
    
    // Match the prompt format of the real service for consistency
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

  static async generateImage(options) {
    const prompt = this.buildPrompt(options);
    const { style, colorPalette, subject } = options;
    
    // Create a more descriptive placeholder that shows the selected options
    const placeholderText = encodeURIComponent(`${style} Poster\n${colorPalette} palette\n${subject}`);
    
    // Return a static placeholder image URL with the options encoded
    return {
      imageUrl: `https://placehold.co/1024x1024/png?text=${placeholderText}`,
      prompt
    };
  }
}

module.exports = StubImageGeneratorService; 