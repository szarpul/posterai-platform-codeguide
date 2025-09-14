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

      expect(response.body).toEqual({
        theme: expect.arrayContaining(['nature', 'urban', 'fantasy', 'futuristic']),
        palette: expect.arrayContaining(['bright', 'dark', 'pastel', 'neutral']),
        style: expect.arrayContaining(['realistic', 'cartoon', 'surreal', 'minimalist', 'flat_vector', 'vintage_retro']),
        main_element: expect.arrayContaining(['photo_realistic', 'illustration_drawing', 'abstract_shapes']),
        occasion: expect.arrayContaining(['home_decoration', 'office_workspace', 'kids_room', 'gift_special_event']),
        emotion: expect.arrayContaining(['calm', 'energetic', 'nostalgic', 'inspirational'])
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