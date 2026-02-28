const mockSupabase = {
  from: jest.fn(),
  storage: {
    from: jest.fn(),
  },
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      error: null,
    }),
    admin: {
      getUserById: jest.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
        },
        error: null,
      }),
    },
  },
};

const mockOpenAI = {
  images: {
    generate: jest.fn().mockResolvedValue({
      data: [{ url: 'https://example.com/mock-image.jpg' }],
    }),
  },
};

const MOCK_STRIPE_SECRET = 'whsec_test_secret';
const MOCK_STRIPE_SIGNATURE = 'v1=mock_signature';

const mockStripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({
      id: 'mock-payment-intent-id',
      client_secret: 'mock-client-secret',
    }),
    confirm: jest.fn(),
    retrieve: jest.fn().mockResolvedValue({
      id: 'mock-payment-intent-id',
      latest_charge: 'mock-charge-id'
    }),
    update: jest.fn().mockResolvedValue({
      id: 'mock-payment-intent-id',
      receipt_email: 'test@example.com'
    }),
    cancel: jest.fn().mockResolvedValue({
      id: 'mock-payment-intent-id',
      status: 'canceled'
    })
  },
  charges: {
    retrieve: jest.fn().mockResolvedValue({
      id: 'mock-charge-id',
      receipt_url: 'https://pay.stripe.com/receipts/mock',
      receipt_number: 'MOCK-123'
    })
  },
  invoices: {
    create: jest.fn().mockResolvedValue({
      id: 'mock-invoice-id',
      number: 'INV-001'
    }),
    sendInvoice: jest.fn().mockResolvedValue({
      id: 'mock-invoice-id',
      hosted_invoice_url: 'https://invoice.stripe.com/mock',
      number: '001'
    })
  },
  invoiceItems: {
    create: jest.fn().mockResolvedValue({
      id: 'mock-invoice-item-id'
    })
  },
  webhooks: {
    constructEvent: jest.fn().mockImplementation((payload, signature, _secret) => {
      if (!signature) {
        throw new Error('No stripe-signature header value was provided');
      }
      if (signature !== MOCK_STRIPE_SIGNATURE || _secret !== MOCK_STRIPE_SECRET) {
        throw new Error('Invalid signature or secret');
      }
      return payload;
    }),
  },
};

const mockPrintingService = {
  createPrintJob: jest.fn().mockResolvedValue({
    jobId: 'mock-job-id',
    status: 'created',
  }),
  getPrintJobStatus: jest.fn(),
  cancelPrintJob: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();

  // Setup default mock implementations
  mockSupabase.from.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    then: jest.fn().mockResolvedValue({ data: [], error: null }),
  });

  mockStripe.paymentIntents.create.mockResolvedValue({
    id: 'mock-payment-intent-id',
    client_secret: 'mock-client-secret',
  });

  mockPrintingService.createPrintJob.mockResolvedValue({
    jobId: 'mock-job-id',
    status: 'created',
  });
});

// Test auth token
const TEST_AUTH_TOKEN = 'test-auth-token';

// Auth middleware mock that simulates the actual middleware behavior
const mockAuthMiddleware = (req, res, next) => {
  // Add authorization header
  req.headers = {
    ...req.headers,
    authorization: `Bearer ${TEST_AUTH_TOKEN}`,
  };

  // Add user to request object
  req.user = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  next();
};

// Mock modules
jest.mock('../src/lib/supabase', () => ({ supabase: mockSupabase }));
jest.mock('../src/lib/openai', () => mockOpenAI);
jest.mock('stripe', () => jest.fn(() => mockStripe));
jest.mock('../src/lib/printingService', () => mockPrintingService);
jest.mock('../src/middleware/auth', () => ({
  requireAuth: mockAuthMiddleware,
  optionalAuth: mockAuthMiddleware,
}));

module.exports = {
  mockSupabase,
  mockOpenAI,
  mockStripe,
  mockPrintingService,
  mockAuthMiddleware,
  MOCK_STRIPE_SECRET,
  MOCK_STRIPE_SIGNATURE,
  TEST_AUTH_TOKEN,
};
