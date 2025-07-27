# 🚀 Frontend Payment Integration

This document explains the payment integration setup for the PosterAI frontend.

## 📦 Dependencies Added

The following dependencies have been added to `package.json`:

```json
{
  "@stripe/stripe-js": "^2.4.0",
  "@stripe/react-stripe-js": "^2.4.0", 
  "axios": "^1.6.0"
}
```

## 🔧 Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Backend API Configuration
REACT_APP_API_URL=http://localhost:4000/api
```

## 🗂️ New Files Created

### 1. **Payment Service** (`src/services/paymentService.js`)
- Handles API calls to the backend
- Manages order creation, payment intents, and order retrieval
- Includes authentication headers

### 2. **Stripe Configuration** (`src/lib/stripe.js`)
- Initializes Stripe with publishable key
- Exports stripePromise for use in components

### 3. **Checkout Page** (`src/pages/CheckoutPage.jsx`)
- Complete checkout flow with Stripe Elements
- Order summary and payment form
- Handles payment confirmation

### 4. **Order Success Page** (`src/pages/OrderSuccessPage.jsx`)
- Displays order confirmation after successful payment
- Shows order details and next steps
- Links to view orders and create new posters

### 5. **Orders Page** (`src/pages/OrdersPage.jsx`)
- Lists all user orders
- Shows order status and details
- Links to order details and poster views

## 🔄 Updated Files

### 1. **App.js**
- Added new routes for checkout and order pages
- Protected routes with authentication

### 2. **PosterDetailPage.jsx**
- Integrated with payment service
- Added shipping address form
- Updated order creation flow

### 3. **Header.jsx**
- Added "My Orders" navigation link

## 🎯 Payment Flow

1. **User selects a draft** → PosterDetailPage
2. **User fills shipping address** → PosterDetailPage
3. **User clicks "Proceed to Checkout"** → Creates order via API
4. **User is redirected to CheckoutPage** → Stripe Elements form
5. **User enters payment details** → Stripe processes payment
6. **Payment successful** → Redirected to OrderSuccessPage
7. **User can view orders** → OrdersPage

## 🧪 Testing the Integration

### Prerequisites
1. Backend running on `localhost:4000`
2. Supabase configured and connected
3. Stripe publishable key configured
4. Dependencies installed

### Test Steps
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm start
   ```

3. **Test the flow:**
   - Create a draft via questionnaire
   - Go to poster details
   - Fill shipping address
   - Proceed to checkout
   - Complete payment with test card

### Test Cards
Use these Stripe test cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

## 🔒 Security Notes

- Stripe Elements handles sensitive card data
- No card data touches your server
- Payment processing happens on Stripe's servers
- Webhooks handle payment status updates

## 🚨 Common Issues

### 1. **Stripe not loading**
- Check `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set
- Verify the key is correct (starts with `pk_test_` or `pk_live_`)

### 2. **API calls failing**
- Ensure backend is running on `localhost:4000`
- Check authentication token is present
- Verify CORS is configured on backend

### 3. **Payment not processing**
- Check Stripe webhook is configured
- Verify webhook secret is set in backend
- Check backend logs for webhook processing

## 📱 Responsive Design

All payment pages are fully responsive:
- Mobile-first design
- Works on desktop, tablet, and mobile
- Stripe Elements adapts to screen size

## 🎨 Styling

Payment components use Tailwind CSS:
- Consistent with existing design
- Custom Stripe Elements styling
- Responsive grid layouts
- Loading states and error handling

## 🔄 Next Steps

1. **Install dependencies** and test the flow
2. **Configure environment variables**
3. **Test with real Stripe account**
4. **Add error handling and edge cases**
5. **Implement order tracking features**

---

**Status:** ✅ Ready for testing  
**Last Updated:** January 2024 