const request = require('supertest');
const express = require('express');
const imageRoutes = require('../../src/routes/images');
const { mockAuthMiddleware, mockOpenAI } = require('../helpers');

const app = express();
app.use(express.json());
app.use(mockAuthMiddleware);
app.use('/api/images', imageRoutes);

describe('Image Routes', () => {
  describe('POST /api/images/generate', () => {
    const validRequest = {
      style: 'modern',
      theme: 'nature',
      mood: 'calm',
      color: 'warm',
      subject: 'landscapes'
    };

    it('should generate an image with valid options', async () => {
      const response = await request(app)
        .post('/api/images/generate')
        .send(validRequest)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          imageUrl: expect.any(String)
        })
      );

      expect(mockOpenAI.images.generate).toHaveBeenCalledWith({
        prompt: expect.any(String),
        n: 1,
        size: expect.any(String)
      });
    });

    it('should validate required fields', async () => {
      const invalidRequest = {
        style: 'modern',
        // missing other required fields
      };

      const response = await request(app)
        .post('/api/images/generate')
        .send(invalidRequest)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: expect.any(String)
      });
    });

    it('should validate option values against allowed options', async () => {
      const invalidRequest = {
        ...validRequest,
        style: 'invalid_style'
      };

      const response = await request(app)
        .post('/api/images/generate')
        .send(invalidRequest)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: expect.any(String)
      });
    });

    it('should handle OpenAI API errors gracefully', async () => {
      mockOpenAI.images.generate.mockRejectedValueOnce(
        new Error('OpenAI API error')
      );

      const response = await request(app)
        .post('/api/images/generate')
        .send(validRequest)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({
        error: expect.stringContaining('Failed to generate image')
      });
    });
  });
}); 