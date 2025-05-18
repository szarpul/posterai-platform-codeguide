const stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripeClient; 