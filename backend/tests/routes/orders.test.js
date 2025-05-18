const request = require('supertest');
const express = require('express');
const orderRoutes = require('../../src/routes/orders');
const { mockAuthMiddleware, MOCK_STRIPE_SIGNATURE } = require('../helpers');

const app = express();
app.use(express.json({ type: 'application/json' }));
app.use(express.raw({ type: 'application/json' })); // Required for Stripe webhooks
app.use(mockAuthMiddleware); // Apply auth middleware
app.use('/api/orders', orderRoutes);

describe('Order Routes', () => {
  const validOrder = {
    draftId: 'mock-draft-id',
    size: 'A4',
    material: '200gsm matte',
    finish: 'matte',
    shippingAddress: {
      name: 'John Doe',
      street: 'Test Street 123',
      city: 'Test City',
      postalCode: '12-345',
      country: 'Poland'
    },
    paymentMethod: 'stripe'
  };

  describe('POST /api/orders', () => {
    it('should create an order with valid data', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrder)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          orderId: expect.any(String),
          status: 'pending',
          total: expect.any(Number)
        })
      );
    });

    it('should validate required fields', async () => {
      const invalidOrder = {
        size: 'A4',
        // missing other required fields
      };

      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: expect.any(String)
      });
    });

    it('should validate shipping address format', async () => {
      const invalidOrder = {
        ...validOrder,
        shippingAddress: {
          name: 'John Doe',
          // missing required address fields
        }
      };

      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: expect.any(String)
      });
    });
  });

  describe('GET /api/orders/:orderId', () => {
    it('should return order details for valid order ID', async () => {
      const orderId = 'mock-order-id';
      
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          orderId: orderId,
          status: expect.any(String),
          total: expect.any(Number),
          shippingAddress: expect.any(Object)
        })
      );
    });

    it('should return 404 for non-existent order', async () => {
      // Mock Supabase to return no data
      const { mockSupabase } = require('../helpers');
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null })
      });

      const response = await request(app)
        .get('/api/orders/non-existent-id')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Order not found'
      });
    });
  });

  describe('POST /api/orders/webhook', () => {
    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          metadata: {
            orderId: 'mock-order-id'
          }
        }
      }
    };

    it('should handle Stripe webhook events', async () => {
      const response = await request(app)
        .post('/api/orders/webhook')
        .send(mockEvent)
        .set('stripe-signature', MOCK_STRIPE_SIGNATURE)
        .expect(200);

      expect(response.body).toEqual({
        received: true
      });
    });

    it('should validate Stripe signature', async () => {
      const response = await request(app)
        .post('/api/orders/webhook')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: expect.any(String)
      });
    });
  });
}); 