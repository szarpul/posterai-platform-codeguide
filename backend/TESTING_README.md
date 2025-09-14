# Backend Testing Guide

This document explains how to run the comprehensive test suite for the poster platform backend, including the newly implemented receipt functionality.

## 🧪 Test Structure

### Unit Tests
- **`tests/routes/orders.test.js`** - Tests for order routes including receipt endpoints
- **`tests/services/receiptService.test.js`** - Tests for the ReceiptService class
- **`tests/helpers.js`** - Mock implementations for testing

### Integration Tests
- **`scripts/test-receipt-service.js`** - Basic receipt service functionality test
- **`scripts/test-receipt-integration.js`** - Complete receipt flow integration test

## 🚀 Running Tests

### 1. Unit Tests (Jest)

```bash
# Run all tests
npm test

# Run specific test files
npm test tests/routes/orders.test.js
npm test tests/services/receiptService.test.js

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### 2. Integration Tests

```bash
# Test basic receipt service
node scripts/test-receipt-service.js

# Test complete receipt integration
node scripts/test-receipt-integration.js
```

## 📋 Test Coverage

### Order Routes Tests
- ✅ Order creation and validation
- ✅ Payment intent creation
- ✅ Webhook handling (payment_intent.succeeded, charge.succeeded)
- ✅ Receipt endpoints (GET, POST, test)
- ✅ Order management (GET, DELETE)
- ✅ Error handling and edge cases

### Receipt Service Tests
- ✅ Payment receipt sending
- ✅ Stripe invoice creation and sending
- ✅ Receipt data storage
- ✅ Receipt retrieval
- ✅ Service testing functionality
- ✅ Error handling and graceful failures

### Webhook Tests
- ✅ `payment_intent.succeeded` events
- ✅ `charge.succeeded` events (newly added)
- ✅ Events without orderId metadata
- ✅ Payment failure events
- ✅ Unknown event types
- ✅ Error handling during webhook processing

## 🔧 Test Configuration

### Environment Variables
Make sure these are set in your `.env` file:
```bash
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Mock Data
The tests use comprehensive mock data:
- **Mock Orders**: Complete order objects with drafts and shipping info
- **Mock Users**: User data with authentication details
- **Mock Stripe**: Payment intents, charges, invoices, and webhooks
- **Mock Supabase**: Database operations and auth admin functions

## 🎯 What Each Test Validates

### 1. Receipt Service Basic Test
- Stripe API connection
- Payment intent creation/cancellation
- Service initialization

### 2. Receipt Integration Test
- Complete webhook-to-receipt flow
- Data preparation and validation
- Stripe invoice creation
- Receipt storage and retrieval
- Error handling scenarios

### 3. Unit Tests
- Individual method functionality
- Input validation
- Error conditions
- Edge cases
- Mock interactions

## 🚨 Common Test Issues

### Stripe API Errors
```bash
# If you see Stripe connection errors:
❌ Receipt service test failed: Stripe connection failed

# Check your STRIPE_SECRET_KEY in .env
# Ensure you're using test keys, not live keys
```

### Supabase Connection Issues
```bash
# If you see Supabase errors:
❌ Failed to send payment receipt: User email not found

# Check your SUPABASE_SERVICE_ROLE_KEY in .env
# Ensure the key has admin permissions
```

### Database Schema Issues
```bash
# If you see database errors:
❌ Order not found: test-order-id

# Ensure your database has the required tables:
# - orders (with receipt fields)
# - drafts
# - auth.users
```

## 📊 Test Results Interpretation

### Successful Test Run
```
✅ Receipt service test result: {
  success: true,
  message: 'Receipt service is working correctly',
  stripeConnected: true,
  testPaymentIntentId: 'pi_test_...'
}

🎯 All receipt integration tests completed successfully!
```

### Failed Test Run
```
❌ Receipt service test failed: {
  success: false,
  error: 'Stripe connection failed',
  stripeConnected: false
}
```

## 🔄 Continuous Integration

### GitHub Actions
Add this to your `.github/workflows/test.yml`:
```yaml
- name: Run Backend Tests
  run: |
    cd backend
    npm install
    npm test
    node scripts/test-receipt-integration.js
```

### Pre-commit Hooks
Add to your `package.json`:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }
  }
}
```

## 🧹 Test Cleanup

### Stripe Test Data
The tests create test payment intents that are automatically cancelled:
```javascript
// In ReceiptService.testReceiptService()
await stripe.paymentIntents.cancel(testPaymentIntent.id);
```

### Database Test Data
Tests use mock data and don't create actual database records.

## 📈 Performance Testing

### Load Testing Receipts
```bash
# Test receipt service under load
for i in {1..10}; do
  node scripts/test-receipt-service.js &
done
wait
```

### Webhook Load Testing
```bash
# Simulate multiple webhook events
for i in {1..5}; do
  curl -X POST http://localhost:4000/api/orders/webhook \
    -H "Content-Type: application/json" \
    -d '{"type":"charge.succeeded","data":{"object":{"metadata":{"orderId":"test-'"$i"'"},"id":"ch_test'"$i"'"}}}' &
done
wait
```

## 🔍 Debugging Tests

### Verbose Logging
```bash
# Run tests with detailed logging
npm test -- --verbose

# Run specific test with console.log output
npm test -- --verbose tests/services/receiptService.test.js
```

### Test Isolation
```bash
# Run tests in isolation
npm test -- --runInBand

# Run specific test suite
npm test -- --testNamePattern="ReceiptService"
```

## 📚 Additional Resources

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Stripe Testing**: https://stripe.com/docs/testing
- **Supabase Testing**: https://supabase.com/docs/guides/testing

## 🎉 Test Success Checklist

Before considering your receipt system fully tested:

- [ ] All unit tests pass (`npm test`)
- [ ] Receipt service test passes (`node scripts/test-receipt-service.js`)
- [ ] Integration test passes (`node scripts/test-receipt-integration.js`)
- [ ] Webhook tests pass for both `payment_intent.succeeded` and `charge.succeeded`
- [ ] Error handling tests pass
- [ ] Edge case tests pass
- [ ] Mock interactions are properly validated

## 🚀 Next Steps After Testing

1. **Deploy to staging** and test with real Stripe webhooks
2. **Monitor production logs** for receipt generation
3. **Verify customer emails** are received
4. **Check Stripe dashboard** for invoice creation
5. **Validate database** receipt records are created

---

**Happy Testing! 🧪✨**

