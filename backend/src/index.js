const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Import routes
const questionnaireRoutes = require('./routes/questionnaire');
const imageRoutes = require('./routes/images');
const orderRoutes = require('./routes/orders');
const draftsRoutes = require('./routes/drafts');
const webhookRoutes = require('./routes/webhooks');
const emailRoutes = require('./routes/email');

// Middleware
// FRONTEND_URL is always used when provided; fallback to localhost for local dev
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

// Patterns for dynamic origins (only in non-production for staging/preview environments)
const allowedOriginPatterns = process.env.NODE_ENV === 'production'
  ? []
  : [
      // Vercel preview deployments: posterai-git-{branch}-{hash}-piotrs-projects-d087cc3c.vercel.app
      /^https:\/\/posterai-git-[a-z0-9-]+-piotrs-projects-d087cc3c\.vercel\.app$/,
      // Local development on any port
      /^http:\/\/localhost:\d+$/
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check exact matches first
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Check pattern matches (for Vercel previews, etc.)
      const matchesPattern = allowedOriginPatterns.some(pattern => pattern.test(origin));
      if (matchesPattern) {
        return callback(null, true);
      }
      
      console.warn(`CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')} + Vercel previews`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/drafts', draftsRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/email', emailRoutes);

// Special handling for Stripe webhook
app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});