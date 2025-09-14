const ReceiptService = require('../../src/services/receiptService');
const { mockSupabase, mockStripe } = require('../helpers');

// Mock the ReceiptService dependencies
jest.mock('../../src/lib/supabase', () => ({ supabase: mockSupabase }));
jest.mock('stripe', () => jest.fn(() => mockStripe));

describe('ReceiptService', () => {
  const mockOrder = {
    id: 'test-order-id',
    user_id: 'test-user-id',
    size: 'A4',
    finish: 'matte',
    amount_cents: 2999,
    created_at: '2024-01-01T00:00:00Z',
    shipping_address: {
      name: 'John Doe',
      city: 'Test City',
      country: 'PL'
    },
    drafts: {
      image_url: 'https://example.com/test-poster.png'
    }
  };

  const mockUser = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com'
    }
  };

  const mockPaymentIntent = {
    id: 'pi_test123',
    latest_charge: 'ch_test123'
  };

  const mockCharge = {
    id: 'ch_test123',
    receipt_url: 'https://pay.stripe.com/receipts/test',
    receipt_number: 'TEST-123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockSupabase.auth.admin.getUserById.mockResolvedValue({
      data: mockUser,
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { payment_intent_id: 'pi_test123' },
        error: null
      }),
      update: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ error: null })
    });

    mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);
    mockStripe.charges.retrieve.mockResolvedValue(mockCharge);
    mockStripe.invoices.create.mockResolvedValue({
      id: 'inv_test123',
      number: 'INV-001'
    });
    mockStripe.invoiceItems.create.mockResolvedValue({
      id: 'ii_test123'
    });
    mockStripe.invoices.sendInvoice.mockResolvedValue({
      id: 'inv_test123',
      hosted_invoice_url: 'https://invoice.stripe.com/test',
      number: '001'
    });
  });

  describe('sendPaymentReceipt', () => {
    it('should send payment receipt successfully with provided order data', async () => {
      const result = await ReceiptService.sendPaymentReceipt(
        'test-order-id',
        'test@example.com',
        mockOrder
      );

      expect(result).toEqual({
        success: true,
        receiptId: expect.any(String),
        receiptNumber: expect.any(String),
        customerEmail: 'test@example.com',
        orderId: 'test-order-id'
      });

      // Verify Stripe invoice was created and sent
      expect(mockStripe.invoices.create).toHaveBeenCalledWith({
        customer_email: 'test@example.com',
        collection_method: 'send_invoice',
        days_until_due: null,
        metadata: {
          orderId: 'test-order-id',
          posterType: 'A4 matte',
          customerEmail: 'test@example.com'
        },
        custom_fields: [
          { name: 'Poster Size', value: 'A4' },
          { name: 'Finish', value: 'matte' },
          { name: 'Order Date', value: '1/1/2024' }
        ]
      });

      expect(mockStripe.invoices.sendInvoice).toHaveBeenCalledWith('inv_test123');
    });

    it('should fetch order data when not provided', async () => {
      // Mock order fetch
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null
        })
      });

      const result = await ReceiptService.sendPaymentReceipt(
        'test-order-id',
        'test@example.com'
      );

      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
    });

    it('should handle order not found error', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Order not found' }
        })
      });

      await expect(
        ReceiptService.sendPaymentReceipt('non-existent-id', 'test@example.com')
      ).rejects.toThrow('Receipt sending failed: Order not found: non-existent-id');
    });

    it('should handle user email lookup failure', async () => {
      mockSupabase.auth.admin.getUserById.mockResolvedValue({
        data: null,
        error: { message: 'User not found' }
      });

      await expect(
        ReceiptService.sendPaymentReceipt('test-order-id', 'test@example.com', mockOrder)
      ).rejects.toThrow('Receipt sending failed: User email not found for user ID: test-user-id');
    });

    it('should handle payment intent not found error', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Payment intent not found' }
        })
      });

      await expect(
        ReceiptService.sendPaymentReceipt('test-order-id', 'test@example.com', mockOrder)
      ).rejects.toThrow('Receipt sending failed: Payment intent not found for order');
    });
  });

  describe('sendStripeReceipt', () => {
    const mockReceiptData = {
      orderId: 'test-order-id',
      customerEmail: 'test@example.com',
      amount: 29.99,
      posterSize: 'A4',
      posterFinish: 'matte',
      orderDate: '2024-01-01T00:00:00Z'
    };

    it('should create and send Stripe invoice successfully', async () => {
      const result = await ReceiptService.sendStripeReceipt(
        'pi_test123',
        'test@example.com',
        mockReceiptData
      );

      expect(result).toEqual({
        id: 'inv_test123',
        receipt_url: 'https://invoice.stripe.com/test',
        receipt_number: 'INV-001',
        invoice_url: 'https://invoice.stripe.com/test'
      });

      expect(mockStripe.invoices.create).toHaveBeenCalledWith({
        customer_email: 'test@example.com',
        collection_method: 'send_invoice',
        days_until_due: null,
        metadata: {
          orderId: 'test-order-id',
          posterType: 'A4 matte',
          customerEmail: 'test@example.com'
        },
        custom_fields: [
          { name: 'Poster Size', value: 'A4' },
          { name: 'Finish', value: 'matte' },
          { name: 'Order Date', value: '1/1/2024' }
        ]
      });

      expect(mockStripe.invoiceItems.create).toHaveBeenCalledWith({
        customer_email: 'test@example.com',
        invoice: 'inv_test123',
        amount: 2999, // Converted back to cents
        currency: 'usd',
        description: 'Custom AI-Generated Poster - A4 matte',
        metadata: {
          orderId: 'test-order-id',
          posterSize: 'A4',
          posterFinish: 'matte'
        }
      });

      expect(mockStripe.invoices.sendInvoice).toHaveBeenCalledWith('inv_test123');
    });

    it('should handle Stripe invoice creation failure', async () => {
      mockStripe.invoices.create.mockRejectedValue(new Error('Stripe API error'));

      await expect(
        ReceiptService.sendStripeReceipt('pi_test123', 'test@example.com', mockReceiptData)
      ).rejects.toThrow('Receipt sending failed: Stripe receipt failed: Stripe API error');
    });

    it('should handle Stripe invoice item creation failure', async () => {
      mockStripe.invoiceItems.create.mockRejectedValue(new Error('Invoice item creation failed'));

      await expect(
        ReceiptService.sendStripeReceipt('pi_test123', 'test@example.com', mockReceiptData)
      ).rejects.toThrow('Receipt sending failed: Stripe receipt failed: Invoice item creation failed');
    });

    it('should handle Stripe invoice sending failure', async () => {
      mockStripe.invoices.sendInvoice.mockRejectedValue(new Error('Invoice sending failed'));

      await expect(
        ReceiptService.sendStripeReceipt('pi_test123', 'test@example.com', mockReceiptData)
      ).rejects.toThrow('Receipt sending failed: Stripe receipt failed: Invoice sending failed');
    });
  });

  describe('storeReceiptInfo', () => {
    const mockReceipt = {
      id: 'inv_test123',
      receipt_number: 'INV-001',
      receipt_url: 'https://invoice.stripe.com/test'
    };

    it('should store receipt information successfully', async () => {
      await ReceiptService.storeReceiptInfo('test-order-id', mockReceipt);

      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        receipt_sent_at: expect.any(String),
        receipt_id: 'inv_test123',
        receipt_number: 'INV-001',
        receipt_url: 'https://invoice.stripe.com/test'
      });
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'test-order-id');
    });

    it('should handle database update errors gracefully', async () => {
      mockSupabase.from().then.mockResolvedValue({
        error: { message: 'Database update failed' }
      });

      // Should not throw error
      await expect(
        ReceiptService.storeReceiptInfo('test-order-id', mockReceipt)
      ).resolves.toBeUndefined();
    });

    it('should handle database exceptions gracefully', async () => {
      mockSupabase.from().then.mockRejectedValue(new Error('Database connection failed'));

      // Should not throw error
      await expect(
        ReceiptService.storeReceiptInfo('test-order-id', mockReceipt)
      ).resolves.toBeUndefined();
    });
  });

  describe('testReceiptService', () => {
    it('should test Stripe connection successfully', async () => {
      const result = await ReceiptService.testReceiptService();

      expect(result).toEqual({
        success: true,
        message: 'Receipt service is working correctly',
        stripeConnected: true,
        testPaymentIntentId: expect.any(String)
      });

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 100,
        currency: 'usd',
        metadata: { test: 'true' }
      });

      expect(mockStripe.paymentIntents.cancel).toHaveBeenCalledWith(expect.any(String));
    });

    it('should handle Stripe connection test failure', async () => {
      mockStripe.paymentIntents.create.mockRejectedValue(new Error('Stripe connection failed'));

      const result = await ReceiptService.testReceiptService();

      expect(result).toEqual({
        success: false,
        error: 'Stripe connection failed',
        stripeConnected: false
      });
    });
  });

  describe('getReceiptDetails', () => {
    const mockOrderWithReceipt = {
      id: 'test-order-id',
      receipt_sent_at: '2024-01-01T00:00:00Z',
      receipt_id: 'inv_test123',
      receipt_number: 'INV-001',
      receipt_url: 'https://invoice.stripe.com/test',
      amount_cents: 2999,
      created_at: '2024-01-01T00:00:00Z',
      status: 'paid'
    };

    it('should return receipt details for valid order', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrderWithReceipt,
          error: null
        })
      });

      const result = await ReceiptService.getReceiptDetails('test-order-id');

      expect(result).toEqual({
        orderId: 'test-order-id',
        receiptSent: true,
        receiptSentAt: '2024-01-01T00:00:00Z',
        receiptId: 'inv_test123',
        receiptNumber: 'INV-001',
        receiptUrl: 'https://invoice.stripe.com/test',
        amount: 29.99,
        orderDate: '2024-01-01T00:00:00Z',
        status: 'paid'
      });
    });

    it('should handle order not found error', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Order not found' }
        })
      });

      await expect(
        ReceiptService.getReceiptDetails('non-existent-id')
      ).rejects.toThrow('Failed to get receipt details: Order not found');
    });

    it('should handle database query errors', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(new Error('Database query failed'))
      });

      await expect(
        ReceiptService.getReceiptDetails('test-order-id')
      ).rejects.toThrow('Failed to get receipt details: Database query failed');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing draft data gracefully', async () => {
      const orderWithoutDraft = { ...mockOrder, drafts: null };

      const result = await ReceiptService.sendPaymentReceipt(
        'test-order-id',
        'test@example.com',
        orderWithoutDraft
      );

      expect(result.success).toBe(true);
    });

    it('should handle missing shipping address gracefully', async () => {
      const orderWithoutShipping = { ...mockOrder, shipping_address: null };

      const result = await ReceiptService.sendPaymentReceipt(
        'test-order-id',
        'test@example.com',
        orderWithoutShipping
      );

      expect(result.success).toBe(true);
    });

    it('should handle zero amount orders', async () => {
      const freeOrder = { ...mockOrder, amount_cents: 0 };

      const result = await ReceiptService.sendPaymentReceipt(
        'test-order-id',
        'test@example.com',
        freeOrder
      );

      expect(result.success).toBe(true);
    });
  });
});

