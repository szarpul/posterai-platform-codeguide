# 🧪 E2E Testing Guide

## Overview
This is the main end-to-end testing guide for the PosterAI platform. It covers the complete user journey from registration to payment completion and order management. This document is updated after each development session to reflect the current state of the application.

## 🚀 **Pre-Test Setup (2 minutes)**

### **1. Environment Check**
```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend  
cd frontend
npm start

# Terminal 3: Verify Backend Health
curl http://localhost:4000/health
# Expected: {"status":"OK"}

# Terminal 4: Stripe Webhooks (Optional)
stripe listen --forward-to localhost:4000/api/orders/webhook
```

### **2. Environment Variables Check**
Verify these files exist:
- ✅ `frontend/.env` - Contains `REACT_APP_API_URL=http://localhost:4000/api`
- ✅ `backend/.env` - Contains Supabase, Stripe, and Prodigi keys

### **3. External Service Access**
- ✅ **Stripe Dashboard**: `https://dashboard.stripe.com/test/` (for test orders)
- ✅ **Prodigi Dashboard**: `https://sandbox-beta-dashboard.pwinty.com/dashboard` (for test orders)

---

## 📋 **Complete E2E Test Flow (8-10 minutes)**

### **✅ Test 1: User Authentication (1 min)**
1. **Go to** `http://localhost:3000`
2. **Click "Sign Up"** → Create account: `test@example.com` / `password123`
3. **Verify** → Redirected to home, see email in header
4. **Sign Out** → Click "Sign Out"
5. **Sign In** → Use same credentials, verify logged in

### **✅ Test 2: Poster Creation Flow (2 min)**
1. **Click "Create Poster"** → Should go to questionnaire
2. **Complete all 5 steps**:
   - Style: Modern
   - Theme: Nature  
   - Mood: Calm
   - Color Palette: Warm
   - Subject: Landscapes
3. **Click "Generate Poster Preview"** → Should show loading, then image
4. **Click "Save as Draft"** → Should save successfully
5. **Go to "My Drafts"** → Should see your draft

### **✅ Test 3: Order Creation & Payment (3 min)**
1. **Click on your draft** → Should go to poster detail page
2. **Fill shipping address**:
   - Name: Test User
   - Address: 123 Test St
   - City: Test City
   - Postal Code: 12345
   - Country: PL
3. **Select options** → A4 size, Matte finish
4. **Click "Proceed to Checkout"** → Should create order, redirect to checkout
5. **Complete payment** → Use test card: `4242 4242 4242 4242`
   - Expiry: 12/25
   - CVC: 123
6. **Verify** → Should redirect to order success page

### **✅ Test 4: Order Management (2 min)**
1. **Go to "My Orders"** → Should see completed order
2. **Click "View Details"** → Should show order success page
3. **Go back to "My Orders"** → Verify status is "PAID"
4. **Click "View Poster"** → Should go to poster detail page

### **✅ Test 5: Pending Order Management (2 min)**
1. **Create another draft** → Follow Test 2 again
2. **Go to poster detail** → Fill shipping address
3. **Click "Proceed to Checkout"** → Should create pending order
4. **Don't complete payment** → Close checkout page
5. **Go to "My Orders"** → Should see pending order with "Complete Payment" button
6. **Click "Discard Order"** → Should show confirmation dialog
7. **Confirm deletion** → Should see fade-out animation, order disappears

### **✅ Test 6: Navigation & UI (1 min)**
1. **Verify all navigation links work**:
   - "Create Poster" → Questionnaire
   - "My Drafts" → Drafts list  
   - "My Orders" → Orders list
2. **Check responsive design** → Resize browser window
3. **Verify loading states** → All pages show loading spinners

---

## 🔍 **External Service Verification (5 minutes)**

### **✅ Test 7: Stripe Dashboard Verification**
1. **Open Stripe Dashboard**: `https://dashboard.stripe.com/test/`
2. **Navigate to**: Payments → Test Mode
3. **Look for your test payment**:
   - Should see payment with amount matching your order
   - Status should be "Succeeded"
   - Metadata should contain your order ID
4. **Check Payment Intent**:
   - Click on the payment to see details
   - Verify webhook was sent successfully
   - Check that metadata contains: `orderId`, `draftId`, `userId`

### **✅ Test 8: Prodigi Dashboard Verification**
1. **Open Prodigi Dashboard**: `https://sandbox-beta-dashboard.pwinty.com/dashboard`
2. **Log in with your Prodigi credentials**
3. **Navigate to Orders section**
4. **Look for your test order**:
   - Should see order with ID like `ord_xxxxxxxxx`
   - Status should be "In Progress" or "Created"
   - Recipient should match your shipping address
   - SKU should be `GLOBAL-CFPM-A4` (for A4 size)
5. **Check Order Details**:
   - Verify shipping address is correct (`line1` format)
   - Check that image URL is accessible
   - Confirm order was created after payment

### **✅ Test 9: API Verification**
```bash
# Verify Prodigi order via API
curl -H "X-API-Key: YOUR_PRODIGI_API_KEY" \
     https://api.sandbox.prodigi.com/v4.0/orders

# Verify Stripe payment via API
curl -H "Authorization: Bearer YOUR_STRIPE_SECRET_KEY" \
     https://api.stripe.com/v1/payment_intents
```

---

## 🔍 **Expected Console Logs**

### **During Order Creation:**
```
🌐 API Base URL: http://localhost:4000/api
📡 Making request to: http://localhost:4000/api/orders
🔐 Auth interceptor - Session: exists
🔐 Auth interceptor - Access token: exists
🔐 Auth interceptor - Added Authorization header
```

### **During Orders Page:**
```
📋 OrdersPage - User: [user object]
📋 OrdersPage - Fetching user orders...
📋 OrdersPage - Orders data received: [orders array]
```

### **During Payment Processing:**
```
📥 Received webhook event: payment_intent.succeeded
💰 Processing payment success for order: [order-id]
✅ Order status updated to paid: [order-id]
Mock: Creating print job { orderId: '...', ... }
```

### **During Prodigi Integration:**
```
📤 Sending order to Prodigi...
✅ Test order created successfully
🆔 Prodigi Order ID: ord_xxxxxxxxx
📊 Order Status: { stage: 'InProgress', ... }
```

---

## 🚨 **Common Issues & Quick Fixes**

### **Issue: 404 Errors**
- **Check**: `frontend/.env` has `REACT_APP_API_URL=http://localhost:4000/api`
- **Fix**: Update environment variable and restart frontend

### **Issue: Authentication Errors**
- **Check**: Supabase credentials in `frontend/.env`
- **Fix**: Verify `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`

### **Issue: Payment Errors**
- **Check**: Stripe keys in `backend/.env`
- **Fix**: Verify `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`

### **Issue: Image Generation Fails**
- **Check**: OpenAI API key in `backend/.env`
- **Fix**: Verify `OPENAI_API_KEY` is valid

### **Issue: Orders Not Loading**
- **Check**: Backend is running on port 4000
- **Fix**: Restart backend with `npm start`

### **Issue: Prodigi Order Creation Fails**
- **Check**: Prodigi API key in `backend/.env`
- **Fix**: Verify `PRODIGI_API_KEY` and `PRODIGI_BASE_URL`
- **Check**: Address format uses `line1` instead of `address`

### **Issue: Stripe Webhook Not Received**
- **Check**: Stripe CLI is running: `stripe listen --forward-to localhost:4000/api/orders/webhook`
- **Fix**: Restart Stripe CLI and verify webhook endpoint

---

## ✅ **Success Criteria**

All tests pass when:
- ✅ User can sign up/sign in without errors
- ✅ Poster creation works end-to-end (questionnaire → image → save)
- ✅ Payment processing completes successfully (Stripe integration)
- ✅ Order management works (view details, discard pending orders)
- ✅ Navigation between all pages works smoothly
- ✅ No console errors or 404s
- ✅ All animations work (fade-out on order deletion)
- ✅ Responsive design works on different screen sizes
- ✅ **Stripe Dashboard**: Payment appears with correct metadata
- ✅ **Prodigi Dashboard**: Order created with correct shipping address
- ✅ **Order Status**: Changes from "pending" to "IN PRODUCTION"

---

## 🎯 **System Status After Tests**

| Component | Status | Notes |
|-----------|--------|-------|
| **User Authentication** | ✅ Working | Supabase auth integration |
| **Poster Creation** | ✅ Working | Questionnaire → AI generation → Save |
| **Order Creation** | ✅ Working | Creates orders in database |
| **Payment Processing** | ✅ Working | Stripe integration + webhooks |
| **Prodigi Integration** | ✅ Working | Print job creation + status updates |
| **Order Management** | ✅ Working | View, discard, status updates |
| **UI/UX** | ✅ Working | Animations, responsive design |
| **Navigation** | ✅ Working | All routes functional |
| **External Dashboards** | ✅ Working | Stripe + Prodigi verification |

---

## 🚀 **Quick Start Commands**

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend  
cd frontend && npm start

# Terminal 3: Health Check
curl http://localhost:4000/health

# Terminal 4: Stripe Webhooks (Optional)
stripe listen --forward-to localhost:4000/api/orders/webhook
```

**Total Test Time**: ~15 minutes (including external verification)  
**Status**: All systems operational ✅

---

## 📚 **Reference Documents**

- `NEXT_SESSION_STARTER.md` - Session summary and next steps
- `verifications/BACKEND_API_TESTING.md` - Backend API and webhook testing
- `backend/test-payment-success.js` - Mock webhook testing
- `backend/test-order-endpoints.js` - Order API testing
- `backend/scripts/test-prodigi-integration.js` - Prodigi integration testing

---

## 🔗 **External Service URLs**

### **Stripe Dashboard**
- **Test Mode**: `https://dashboard.stripe.com/test/`
- **Payments**: `https://dashboard.stripe.com/test/payments`
- **Webhooks**: `https://dashboard.stripe.com/test/webhooks`

### **Prodigi Dashboard**
- **Sandbox**: `https://sandbox-beta-dashboard.pwinty.com/dashboard`
- **API Base**: `https://api.sandbox.prodigi.com/v4.0`
- **Orders API**: `https://api.sandbox.prodigi.com/v4.0/orders`

---

**Last Updated**: August 2025  
**Version**: 2.0  
**Status**: ✅ Complete Payment + Print Platform Ready 