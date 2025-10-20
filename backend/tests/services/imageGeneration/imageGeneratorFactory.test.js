const ImageGeneratorFactory = require('../../../src/services/imageGeneration/ImageGeneratorFactory');
const OpenAIProvider = require('../../../src/services/imageGeneration/OpenAIProvider');
const LeonardoProvider = require('../../../src/services/imageGeneration/LeonardoProvider');
const StubProvider = require('../../../src/services/imageGeneration/StubProvider');

// Mock the Leonardo SDK
jest.mock('../../../src/lib/leonardo', () => ({
  generations: {
    create: jest.fn(),
    get: jest.fn()
  }
}));

describe('ImageGeneratorFactory', () => {
  beforeEach(() => {
    // Reset environment variables
    delete process.env.IMAGE_GENERATION_PROVIDER;
    // Set NODE_ENV to test to avoid Leonardo SDK initialization errors
    process.env.NODE_ENV = 'test';
  });

  describe('createProvider', () => {
    it('should create OpenAI provider by default', () => {
      const provider = ImageGeneratorFactory.createProvider();
      expect(provider).toBeInstanceOf(OpenAIProvider);
    });

    it('should create OpenAI provider when specified', () => {
      const provider = ImageGeneratorFactory.createProvider('openai');
      expect(provider).toBeInstanceOf(OpenAIProvider);
    });

    it('should create Leonardo provider when specified', () => {
      const provider = ImageGeneratorFactory.createProvider('leonardo');
      expect(provider).toBeInstanceOf(LeonardoProvider);
    });

    it('should create Stub provider when specified', () => {
      const provider = ImageGeneratorFactory.createProvider('stub');
      expect(provider).toBeInstanceOf(StubProvider);
    });

    it('should throw error for unsupported provider', () => {
      expect(() => {
        ImageGeneratorFactory.createProvider('unsupported');
      }).toThrow('Unsupported image generation provider: unsupported');
    });

    it('should be case insensitive', () => {
      const provider = ImageGeneratorFactory.createProvider('LEONARDO');
      expect(provider).toBeInstanceOf(LeonardoProvider);
    });
  });

  describe('getDefaultProvider', () => {
    it('should return OpenAI provider by default', () => {
      const provider = ImageGeneratorFactory.getDefaultProvider();
      expect(provider).toBeInstanceOf(OpenAIProvider);
    });

    it('should return provider based on environment variable', () => {
      process.env.IMAGE_GENERATION_PROVIDER = 'leonardo';
      const provider = ImageGeneratorFactory.getDefaultProvider();
      expect(provider).toBeInstanceOf(LeonardoProvider);
    });
  });

  describe('getAvailableProviders', () => {
    it('should return list of available providers', () => {
      const providers = ImageGeneratorFactory.getAvailableProviders();
      expect(providers).toEqual(['openai', 'leonardo', 'stub']);
    });
  });

  describe('isProviderSupported', () => {
    it('should return true for supported providers', () => {
      expect(ImageGeneratorFactory.isProviderSupported('openai')).toBe(true);
      expect(ImageGeneratorFactory.isProviderSupported('leonardo')).toBe(true);
      expect(ImageGeneratorFactory.isProviderSupported('stub')).toBe(true);
    });

    it('should return false for unsupported providers', () => {
      expect(ImageGeneratorFactory.isProviderSupported('unsupported')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(ImageGeneratorFactory.isProviderSupported('OPENAI')).toBe(true);
    });
  });
});
