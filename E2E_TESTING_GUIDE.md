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
- ✅ `backend/.env` - Contains Supabase and Stripe keys

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

---

## 🎯 **System Status After Tests**

| Component | Status | Notes |
|-----------|--------|-------|
| **User Authentication** | ✅ Working | Supabase auth integration |
| **Poster Creation** | ✅ Working | Questionnaire → AI generation → Save |
| **Order Creation** | ✅ Working | Creates orders in database |
| **Payment Processing** | ✅ Working | Stripe integration + webhooks |
| **Order Management** | ✅ Working | View, discard, status updates |
| **UI/UX** | ✅ Working | Animations, responsive design |
| **Navigation** | ✅ Working | All routes functional |

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

**Total Test Time**: ~10 minutes  
**Status**: All systems operational ✅

---

## 📚 **Reference Documents**

- `NEXT_SESSION_STARTER.md` - Session summary and next steps
- `verifications/BACKEND_API_TESTING.md` - Backend API and webhook testing
- `backend/test-payment-success.js` - Mock webhook testing
- `backend/test-order-endpoints.js` - Order API testing

---

**Last Updated**: January 2024  
**Version**: 1.0  
**Status**: ✅ Complete Payment Platform Ready 