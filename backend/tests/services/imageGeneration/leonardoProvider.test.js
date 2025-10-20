const LeonardoProvider = require('../../../src/services/imageGeneration/LeonardoProvider');

// Mock the Leonardo SDK
jest.mock('../../../src/lib/leonardo', () => ({
  generations: {
    create: jest.fn(),
    get: jest.fn()
  }
}));

const leonardo = require('../../../src/lib/leonardo');

describe('LeonardoProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new LeonardoProvider();
    jest.clearAllMocks();
  });

  describe('generateRawImage', () => {
    it('should generate an image successfully', async () => {
      const mockPrompt = 'test prompt';
      const mockGenerationId = 'test-generation-id';
      const mockImageUrl = 'https://example.com/image.png';

      // Mock the generation creation
      leonardo.generations.create.mockResolvedValue({
        sdGenerationJob: {
          generationId: mockGenerationId
        }
      });

      // Mock the polling result
      leonardo.generations.get.mockResolvedValue({
        generations_by_pk: {
          status: 'COMPLETE',
          generated_images: [{ url: mockImageUrl }]
        }
      });

      const result = await provider.generateRawImage(mockPrompt);

      expect(result).toBe(mockImageUrl);
      expect(leonardo.generations.create).toHaveBeenCalledWith({
        prompt: mockPrompt,
        modelId: 'leonardo-phoenix-1.0',
        width: 1024,
        height: 1024,
        numImages: 1,
        guidanceScale: 7,
        steps: 20
      });
    });

    it('should throw error when generation creation fails', async () => {
      const mockPrompt = 'test prompt';

      leonardo.generations.create.mockRejectedValue(new Error('API Error'));

      await expect(provider.generateRawImage(mockPrompt)).rejects.toThrow('Leonardo.ai generation failed: API Error');
    });

    it('should throw error when no generation ID is returned', async () => {
      const mockPrompt = 'test prompt';

      leonardo.generations.create.mockResolvedValue({});

      await expect(provider.generateRawImage(mockPrompt)).rejects.toThrow('No generation ID in Leonardo.ai response');
    });
  });

  describe('pollForCompletion', () => {
    it('should return image URL when generation completes', async () => {
      const mockGenerationId = 'test-generation-id';
      const mockImageUrl = 'https://example.com/image.png';

      leonardo.generations.get.mockResolvedValue({
        generations_by_pk: {
          status: 'COMPLETE',
          generated_images: [{ url: mockImageUrl }]
        }
      });

      const result = await provider.pollForCompletion(mockGenerationId);

      expect(result).toBe(mockImageUrl);
    });

    it('should throw error when generation fails', async () => {
      const mockGenerationId = 'test-generation-id';

      leonardo.generations.get.mockResolvedValue({
        generations_by_pk: {
          status: 'FAILED'
        }
      });

      await expect(provider.pollForCompletion(mockGenerationId, 2, 100)).rejects.toThrow('Leonardo.ai generation failed');
    }, 10000);

    it('should timeout after max attempts', async () => {
      const mockGenerationId = 'test-generation-id';

      leonardo.generations.get.mockResolvedValue({
        generations_by_pk: {
          status: 'PENDING'
        }
      });

      await expect(provider.pollForCompletion(mockGenerationId, 2, 100)).rejects.toThrow('Leonardo.ai generation timed out');
    });
  });

  describe('getProviderName', () => {
    it('should return correct provider name', () => {
      expect(provider.getProviderName()).toBe('Leonardo.ai');
    });
  });
});
