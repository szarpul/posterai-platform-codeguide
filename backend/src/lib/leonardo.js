const { Leonardo } = require('@leonardo-ai/sdk');

// Only initialize if API key is provided (skip during tests)
let leonardo = null;

if (process.env.LEONARDO_API_KEY) {
  leonardo = new Leonardo({
    bearerAuth: process.env.LEONARDO_API_KEY
  });
} else if (process.env.NODE_ENV !== 'test') {
  throw new Error('Missing Leonardo.ai API key');
}

module.exports = leonardo;
