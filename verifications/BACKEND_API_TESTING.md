# 🧪 Backend API Testing Guide

## Overview

This guide provides step-by-step instructions to verify that all backend API endpoints, webhooks, and database operations are working correctly using automated test scripts.

## Prerequisites

- Backend server running (`npm start` in `backend/` directory)
- Supabase environment variables configured in `backend/.env`
- All dependencies installed (`npm install` in `backend/`)

## 📋 API Endpoints Reference

### **Base URL**: `http://localhost:4000/api`

### **Health Check**

```http
GET /health
```

**Response**: `{"status":"ok"}`

### **Questionnaire Options**

```http
GET /questionnaire/options
```

**Response**: Available questionnaire choices (styles, themes, moods, etc.)

### **Image Generation**

```http
POST /images/generate
```

**Auth**: Required  
**Body**: `{"responses": {"style": "modern", "theme": "nature", ...}}`

### **Drafts Management**

```http
GET /drafts                    # Get user drafts
POST /drafts                   # Create draft
PUT /drafts/:id               # Update draft
DELETE /drafts/:id            # Delete draft
```

**Auth**: Required for all endpoints

### **Orders Management**

```http
GET /orders                   # Get user orders
POST /orders                  # Create order
GET /orders/:id              # Get single order
DELETE /orders/:id           # Cancel order
POST /orders/:id/payment     # Create payment intent
```

**Auth**: Required for all endpoints

### **Webhooks**

```http
POST /orders/webhook         # Stripe webhook handler
```

**Auth**: None (uses Stripe signature validation)

## 🚀 Quick Start Commands

### **1. Start Backend Server**

```bash
# Terminal 1: Start Backend
cd backend
npm start
```

**Expected Output**:

```
Server running on port 4000
Connected to Supabase
```

### **2. Run Complete Order Flow Test (Main Test)**

```bash
# Terminal 2: Run comprehensive test
cd backend
node scripts/test-complete-order-flow.js
```

**Expected Output**:

```
🔍 Checking backend health...
✅ Backend is running

⚠️  No user ID provided. Creating test user...
🚀 Starting Complete Order Flow Test with New User...

👤 Creating test user...
✅ Test user created: abc123-def456-ghi789
   Email: test-1234567890@example.com

🎨 Creating test draft...
✅ Draft created: xyz789-abc123-def456

📦 Creating test order...
✅ Order created: order123-def456-ghi789
   Status: pending
   Price: $29.99

🧪 Testing payment webhook...
📤 Sending payment success webhook...
Order ID: order123-def456-ghi789
✅ Webhook sent successfully!
Response: { received: true }

🔍 Verifying order status...
📊 Order status after webhook:
   ID: order123-def456-ghi789
   Status: in_production
   Updated at: 1/15/2024, 2:35:30 PM
✅ SUCCESS: Order status updated to "in_production"!
   💡 Note: Status "in_production" means payment succeeded and print job was created

🎉 COMPLETE TEST SUCCESS!
✅ Test user created successfully
✅ Draft created and order flow tested successfully
✅ Payment webhook processed correctly
✅ Order status updated to "paid" or "in_production"
✅ Print job created (if status is "in_production")

---
🧹 Cleaning up test data...
✅ Test order deleted
✅ Test draft deleted
✅ Test user deleted
```

### **3. Additional Test Scripts (Optional)**

```bash
# List existing users
cd backend
node scripts/list-users.js

# List existing orders
cd backend
node scripts/list-orders.js

# Test with specific user ID (optional - creates test user if not provided)
cd backend
node scripts/test-complete-order-flow.js <USER_ID>

# Test email service
cd backend
node scripts/test-email-service.js
```

**Note**:

- `test-complete-order-flow.js` works without any parameters - it creates a test user, draft, and order automatically
- `test-payment-success.js` requires an existing order ID. Use `list-orders.js` first to get an order ID

## ✅ Success Criteria

The backend is working correctly when:

- ✅ **Main Test Passes**: `node test-complete-order-flow.js` runs without errors
- ✅ **Order Status Progression**: `pending` → `paid` → `in_production`
- ✅ **Cleanup Working**: All test data is removed automatically
- ✅ **No Foreign Key Errors**: Database constraints are satisfied
- ✅ **Webhook Processing**: Payment events are handled correctly
- ✅ **Print Job Creation**: External service integration working

**🎯 Single Command Validation:**

```bash
cd backend && node scripts/test-complete-order-flow.js
```

**Success = Complete test passes with cleanup** ✅

---

**Last Updated**: January 2024  
**Version**: 2.0  
**Status**: ✅ Backend API Testing Guide
