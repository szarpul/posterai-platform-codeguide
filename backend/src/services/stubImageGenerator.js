class StubImageGeneratorService {
  static buildPrompt(options) {
    const { style, theme, mood, colorPalette, subject } = options;
    return `Create a ${style} poster with a ${theme} theme. 
    The mood should be ${mood} and use a ${colorPalette} color palette. 
    The main subject is ${subject}. 
    Make it suitable for high-quality printing.`;
  }

  static async generateImage(options) {
    const prompt = this.buildPrompt(options);
    
    // Return a static placeholder image URL
    return {
      imageUrl: 'https://placehold.co/1024x1024/png?text=AI+Generated+Poster+Preview',
      prompt
    };
  }
}

module.exports = StubImageGeneratorService; 