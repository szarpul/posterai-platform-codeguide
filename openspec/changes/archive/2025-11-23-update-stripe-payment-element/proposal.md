## Why

The current credit card payment implementation uses Stripe's legacy `CardElement` component, which requires manual collection of billing address details including postal code. This creates a non-standard payment experience that feels disconnected from typical Stripe integrations. Stripe's modern `PaymentElement` automatically handles billing address collection (including postal code), provides better 3D Secure support, and offers a more seamless payment experience that aligns with Stripe's recommended best practices.

## What Changes

- **BREAKING**: Replace `CardElement` with `PaymentElement` in checkout flow
- Update payment intent creation to include billing address collection configuration
- Remove manual postal code collection from payment form (billing address handled by PaymentElement)
- Improve 3D Secure authentication flow with automatic handling
- Update frontend payment component to use modern Stripe PaymentElement API
- Ensure shipping address remains separate from billing address (collected earlier in flow)

## Impact

- Affected specs: `payment` (new capability)
- Affected code:
  - `frontend/src/pages/CheckoutPage.jsx` - Replace CardElement with PaymentElement
  - `frontend/src/lib/stripe.js` - Ensure PaymentElement is properly configured
  - `backend/src/services/orderProcessor.js` - Update payment intent creation if needed
  - `backend/src/routes/orders.js` - Payment intent endpoint may need adjustments
