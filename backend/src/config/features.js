const features = {
  imageGenerationProvider: process.env.IMAGE_GENERATION_PROVIDER || 'openai',
  leonardoModel: process.env.LEONARDO_MODEL || 'leonardo-phoenix-1.0',
  enableAnonymousImageGeneration: process.env.ENABLE_ANONYMOUS_IMAGE_GENERATION === 'true',
};

module.exports = features; 