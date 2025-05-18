const request = require('supertest');
const express = require('express');
const questionnaireRoutes = require('../../src/routes/questionnaire');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/questionnaire', questionnaireRoutes);

describe('Questionnaire Routes', () => {
  describe('GET /api/questionnaire/options', () => {
    it('should return all questionnaire options grouped by type', async () => {
      const response = await request(app)
        .get('/api/questionnaire/options')
        .expect('Content-Type', /json/)
        .expect(200);

      // Check response structure
      expect(response.body).toEqual(
        expect.objectContaining({
          style: expect.arrayContaining(['modern', 'vintage', 'abstract', 'minimalist']),
          theme: expect.arrayContaining(['nature', 'urban', 'fantasy', 'futuristic']),
          mood: expect.arrayContaining(['calm', 'energetic', 'mysterious', 'joyful']),
          color: expect.arrayContaining(['warm', 'cool', 'monochrome', 'vibrant']),
          subject: expect.arrayContaining(['landscapes', 'portraits', 'animals', 'architecture'])
        })
      );

      // Check that arrays are not empty
      Object.values(response.body).forEach(optionArray => {
        expect(optionArray.length).toBeGreaterThan(0);
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock Supabase error
      jest.spyOn(require('../../src/lib/supabase'), 'from').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .get('/api/questionnaire/options')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to fetch questionnaire options'
      });
    });
  });
}); 