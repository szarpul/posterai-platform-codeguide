## 1. Frontend Implementation

- [x] 1.1 Update `CheckoutPage.jsx` to replace `CardElement` import with `PaymentElement` from `@stripe/react-stripe-js`
- [x] 1.2 Replace `CardElement` component usage with `PaymentElement` in checkout form
- [x] 1.3 Update `confirmCardPayment` to `confirmPayment` with PaymentElement
- [x] 1.4 Remove any manual postal code/billing address fields from payment form
- [x] 1.5 Update payment form styling to accommodate PaymentElement (remove custom card styling if needed)
- [x] 1.6 Update error handling to work with PaymentElement API

## 2. Backend Implementation

- [x] 2.1 Review payment intent creation in `orderProcessor.js` to ensure it supports PaymentElement
- [x] 2.2 Verify payment intent includes appropriate metadata for billing address collection
- [x] 2.3 Ensure webhook handling remains compatible with PaymentElement confirmations

## 3. Testing

- [x] 3.1 Test complete payment flow with test card numbers
- [x] 3.2 Verify billing address (including postal code) is collected automatically
- [x] 3.3 Test 3D Secure authentication flow
- [x] 3.4 Verify shipping address remains separate and unchanged
- [x] 3.5 Test error handling for declined cards and failed payments

## 4. Additional Fixes (Discovered During Testing)

- [x] 4.1 Fixed order confirmation email timing (moved from order creation to after payment success)
- [x] 4.2 Fixed duplicate email issue (removed duplicate charge.succeeded webhook handler)
- [x] 4.3 Added idempotency check to prevent duplicate order processing
- [x] 4.4 Restricted payment methods to cards only (removed BLIK by using payment_method_types instead of automatic_payment_methods)

## 5. Documentation

- [x] 5.1 Payment flow verified and working correctly
- [x] 5.2 Environment variables verified (STRIPE_SECRET_KEY, RESEND_API_KEY configured)
