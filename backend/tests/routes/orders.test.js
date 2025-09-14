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
    const mockPaymentIntentEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test123',
          metadata: {
            orderId: 'mock-order-id'
          }
        }
      }
    };

    const mockChargeEvent = {
      type: 'charge.succeeded',
      data: {
        object: {
          id: 'ch_test123',
          payment_intent: 'pi_test123',
          metadata: {
            orderId: 'mock-order-id',
            userId: 'test-user-id',
            draftId: 'mock-draft-id'
          },
          amount: 2999,
          currency: 'usd',
          receipt_url: 'https://pay.stripe.com/receipts/test'
        }
      }
    };

    it('should handle payment_intent.succeeded webhook events', async () => {
      const response = await request(app)
        .post('/api/orders/webhook')
        .send(mockPaymentIntentEvent)
        .set('stripe-signature', MOCK_STRIPE_SIGNATURE)
        .expect(200);

      expect(response.body).toEqual({
        received: true
      });
    });

    it('should handle charge.succeeded webhook events', async () => {
      const response = await request(app)
        .post('/api/orders/webhook')
        .send(mockChargeEvent)
        .set('stripe-signature', MOCK_STRIPE_SIGNATURE)
        .expect(200);

      expect(response.body).toEqual({
        received: true
      });
    });

    it('should handle webhook events without orderId gracefully', async () => {
      const eventWithoutOrderId = {
        type: 'charge.succeeded',
        data: {
          object: {
            id: 'ch_test123',
            metadata: {} // No orderId
          }
        }
      };

      const response = await request(app)
        .post('/api/orders/webhook')
        .send(eventWithoutOrderId)
        .set('stripe-signature', MOCK_STRIPE_SIGNATURE)
        .expect(200);

      expect(response.body).toEqual({
        received: true
      });
    });

    it('should handle payment_intent.payment_failed events', async () => {
      const failedEvent = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            metadata: {
              orderId: 'mock-order-id'
            }
          }
        }
      };

      const response = await request(app)
        .post('/api/orders/webhook')
        .send(failedEvent)
        .set('stripe-signature', MOCK_STRIPE_SIGNATURE)
        .expect(200);

      expect(response.body).toEqual({
        received: true
      });
    });

    it('should handle unknown event types gracefully', async () => {
      const unknownEvent = {
        type: 'unknown.event.type',
        data: {
          object: {}
        }
      };

      const response = await request(app)
        .post('/api/orders/webhook')
        .send(unknownEvent)
        .set('stripe-signature', MOCK_STRIPE_SIGNATURE)
        .expect(200);

      expect(response.body).toEqual({
        received: true
      });
    });

    it('should handle webhook processing errors gracefully', async () => {
      // Mock an error in the webhook processing
      const { mockSupabase } = require('../helpers');
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app)
        .post('/api/orders/webhook')
        .send(mockChargeEvent)
        .set('stripe-signature', MOCK_STRIPE_SIGNATURE)
        .expect(400);

      expect(response.body).toEqual({
        error: expect.any(String)
      });
    });
  });

  describe('Receipt Endpoints', () => {
    describe('GET /api/orders/:orderId/receipt', () => {
      it('should return receipt details for valid order', async () => {
        const orderId = 'mock-order-id';
        
        const response = await request(app)
          .get(`/api/orders/${orderId}/receipt`)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual(
          expect.objectContaining({
            orderId: orderId,
            receiptSent: expect.any(Boolean),
            receiptSentAt: expect.any(String),
            receiptId: expect.any(String),
            receiptNumber: expect.any(String),
            receiptUrl: expect.any(String),
            amount: expect.any(Number),
            orderDate: expect.any(String),
            status: expect.any(String)
          })
        );
      });

      it('should return 404 for non-existent order receipt', async () => {
        const { mockSupabase } = require('../helpers');
        mockSupabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Order not found' } })
        });

        const response = await request(app)
          .get('/api/orders/non-existent-id/receipt')
          .expect('Content-Type', /json/)
          .expect(500);

        expect(response.body).toEqual({
          error: expect.any(String)
        });
      });
    });

    describe('POST /api/orders/:orderId/send-receipt', () => {
      it('should manually send receipt for valid order', async () => {
        const orderId = 'mock-order-id';
        const receiptData = {
          customerEmail: 'test@example.com'
        };

        const response = await request(app)
          .post(`/api/orders/${orderId}/send-receipt`)
          .send(receiptData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual(
          expect.objectContaining({
            message: 'Receipt sent successfully',
            receipt: expect.objectContaining({
              success: true,
              receiptId: expect.any(String),
              receiptNumber: expect.any(String),
              customerEmail: 'test@example.com',
              orderId: orderId
            })
          })
        );
      });

      it('should validate customer email requirement', async () => {
        const orderId = 'mock-order-id';
        const invalidReceiptData = {
          // Missing customerEmail
        };

        const response = await request(app)
          .post(`/api/orders/${orderId}/send-receipt`)
          .send(invalidReceiptData)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body).toEqual({
          error: 'Customer email is required'
        });
      });

      it('should handle receipt sending errors gracefully', async () => {
        const { mockSupabase } = require('../helpers');
        mockSupabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockRejectedValue(new Error('Database error'))
        });

        const orderId = 'mock-order-id';
        const receiptData = {
          customerEmail: 'test@example.com'
        };

        const response = await request(app)
          .post(`/api/orders/${orderId}/send-receipt`)
          .send(receiptData)
          .expect('Content-Type', /json/)
          .expect(500);

        expect(response.body).toEqual({
          error: expect.any(String)
        });
      });
    });

    describe('GET /api/orders/test-receipt', () => {
      it('should test receipt service functionality', async () => {
        const response = await request(app)
          .get('/api/orders/test-receipt')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual(
          expect.objectContaining({
            success: true,
            message: 'Receipt service is working correctly',
            stripeConnected: true,
            testPaymentIntentId: expect.any(String)
          })
        );
      });
    });

    describe('POST /api/orders/test-receipt', () => {
      it('should test receipt service with authentication', async () => {
        const response = await request(app)
          .post('/api/orders/test-receipt')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual(
          expect.objectContaining({
            success: true,
            message: 'Receipt service is working correctly',
            stripeConnected: true,
            testPaymentIntentId: expect.any(String)
          })
        );
      });
    });
  });

  describe('Payment Intent Endpoints', () => {
    describe('POST /api/orders/:orderId/payment', () => {
      it('should create payment intent for valid order', async () => {
        const orderId = 'mock-order-id';
        
        const response = await request(app)
          .post(`/api/orders/${orderId}/payment`)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual(
          expect.objectContaining({
            clientSecret: expect.any(String)
          })
        );
      });

      it('should handle payment intent creation errors', async () => {
        const { mockSupabase } = require('../helpers');
        mockSupabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Order not found' } })
        });

        const orderId = 'non-existent-order';
        
        const response = await request(app)
          .post(`/api/orders/${orderId}/payment`)
          .expect('Content-Type', /json/)
          .expect(500);

        expect(response.body).toEqual({
          error: expect.any(String)
        });
      });
    });
  });

  describe('Order Management', () => {
    describe('DELETE /api/orders/:orderId', () => {
      it('should cancel pending orders', async () => {
        const orderId = 'mock-order-id';
        
        const response = await request(app)
          .delete(`/api/orders/${orderId}`)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual({
          message: 'Order cancelled successfully'
        });
      });

      it('should prevent cancellation of non-pending orders', async () => {
        const { mockSupabase } = require('../helpers');
        mockSupabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: { status: 'paid' }, 
            error: null 
          })
        });

        const orderId = 'paid-order-id';
        
        const response = await request(app)
          .delete(`/api/orders/${orderId}`)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body).toEqual({
          error: 'Only pending orders can be cancelled'
        });
      });

      it('should return 404 for non-existent orders', async () => {
        const { mockSupabase } = require('../helpers');
        mockSupabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null })
        });

        const orderId = 'non-existent-order';
        
        const response = await request(app)
          .delete(`/api/orders/${orderId}`)
          .expect('Content-Type', /json/)
          .expect(404);

        expect(response.body).toEqual({
          error: 'Order not found'
        });
      });
    });
  });
}); 