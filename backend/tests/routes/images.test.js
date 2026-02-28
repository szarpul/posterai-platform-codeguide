const request = require('supertest');
const express = require('express');
const { mockAuthMiddleware } = require('../helpers');

// Use stub image generation to avoid calling real APIs
process.env.IMAGE_GENERATION_PROVIDER = 'stub';

const imageRoutes = require('../../src/routes/images');

// Mock token for testing
const validToken = 'mock-jwt-token';

const app = express();
app.use(express.json());
app.use(mockAuthMiddleware);
app.use('/api/images', imageRoutes);

describe('Image Routes', () => {
  describe('POST /api/images/generate', () => {
    it('should generate image with valid options', async () => {
      const validOptions = {
        theme: 'nature',
        palette: 'bright',
        style: 'realistic',
        mainElement: 'photo_realistic',
        occasion: 'home_decoration',
        emotion: 'calm',
        inspirationKeyword: 'mountain peaks'
      };

      const response = await request(app)
        .post('/api/images/generate')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validOptions);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('imageUrl');
      expect(response.body).toHaveProperty('prompt');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidOptions = {
        theme: 'nature',
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/images/generate')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidOptions);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing required options');
    });

    it('should work with optional inspirationKeyword', async () => {
      const optionsWithoutKeyword = {
        theme: 'nature',
        palette: 'bright',
        style: 'realistic',
        mainElement: 'photo_realistic',
        occasion: 'home_decoration',
        emotion: 'calm'
        // inspirationKeyword is optional
      };

      const response = await request(app)
        .post('/api/images/generate')
        .set('Authorization', `Bearer ${validToken}`)
        .send(optionsWithoutKeyword);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('imageUrl');
      expect(response.body).toHaveProperty('prompt');
    });
  });
}); 