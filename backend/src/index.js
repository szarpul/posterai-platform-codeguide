const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

logger.info('Environment variables loaded', {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 4000
});

const app = express();

// Import routes
const questionnaireRoutes = require('./routes/questionnaire');
const imageRoutes = require('./routes/images');
const orderRoutes = require('./routes/orders');
const draftsRoutes = require('./routes/drafts');
const webhookRoutes = require('./routes/webhooks');
const emailRoutes = require('./routes/email');

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  })
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

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
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});