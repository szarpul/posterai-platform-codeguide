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

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  })
);
app.use(express.json());

// Routes
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/drafts', draftsRoutes);

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