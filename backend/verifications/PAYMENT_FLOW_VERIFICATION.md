# 🧪 Payment Flow Verification Guide

## Overview
This guide provides step-by-step instructions to verify that the complete payment processing flow is working correctly, from order creation to payment confirmation and print job creation.

## Prerequisites
- Backend running on `localhost:4000`
- Supabase database with orders table migration applied
- Stripe CLI installed and logged in
- Test order ID: `22de3d9f-aab5-4d9f-b3c8-b5332bf11625`

## 🚀 Quick Start Commands

### **1. Start Required Services**

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Stripe Webhook Forwarding
stripe listen --forward-to localhost:4000/api/orders/webhook
```

### **2. Health Check**

```bash
# Terminal 3: Verify Backend is Running
curl http://localhost:4000/health
```

**Expected Output**: `{"status":"OK"}`

### **3. Test Mock Webhook (Optional)**

```bash
# Terminal 3: Test with mock data
cd backend
node test-payment-success.js
```

**Expected Output**:
```
✅ Webhook sent successfully!
Response: { received: true }
✅ Payment success test completed!
```

### **4. Test Real Stripe Webhook**

```bash
# Terminal 3: Trigger real Stripe webhook
stripe trigger payment_intent.succeeded
```

**Expected Output**:
```
Running fixture for: payment_intent
Trigger succeeded! Check dashboard for event details.
```

## ✅ Success Indicators

| Component | Command | Expected Result |
|-----------|---------|-----------------|
| **Backend** | `curl localhost:4000/health` | `{"status":"OK"}` |
| **Stripe CLI** | `stripe listen` | Shows webhook secret and "Ready!" |
| **Mock Webhook** | `node test-payment-success.js` | No errors, success message |
| **Real Webhook** | `stripe trigger payment_intent.succeeded` | "Trigger succeeded!" |
| **Backend Logs** | Check Terminal 1 | Webhook processing logs |
| **Stripe CLI Logs** | Check Terminal 2 | Webhook delivery status |
| **Database** | Supabase Dashboard | Order status updated |

## 🔍 Detailed Verification Steps

### **Step 1: Backend Health Check**
```bash
curl http://localhost:4000/health
```
- **Success**: Returns `{"status":"OK"}`
- **Failure**: Check if backend is running on port 4000

### **Step 2: Stripe CLI Setup**
```bash
stripe listen --forward-to localhost:4000/api/orders/webhook
```
- **Success**: Shows webhook secret and "Ready!" message
- **Failure**: Run `stripe login` first

### **Step 3: Mock Webhook Test**
```bash
cd backend
node test-payment-success.js
```
- **Success**: Webhook processed without errors
- **Failure**: Check backend logs for specific errors

### **Step 4: Real Stripe Webhook Test**
```bash
stripe trigger payment_intent.succeeded
```
- **Success**: "Trigger succeeded!" message
- **Failure**: Check Stripe CLI connection

### **Step 5: Backend Log Verification**
Look for these logs in your backend terminal:
```
📥 Received webhook event: payment_intent.succeeded
 Processing payment success for order: [order-id]
✅ Order status updated to paid: [order-id]
Mock: Creating print job { orderId: '...', ... }
```

### **Step 6: Stripe CLI Log Verification**
Look for these logs in your Stripe CLI terminal:
```
2024-01-XX XX:XX:XX   --> payment_intent.succeeded [evt_...]
2024-01-XX XX:XX:XX  <--  [200] POST http://localhost:4000/api/orders/webhook [evt_...]
```

### **Step 7: Database Verification**
1. Open Supabase Dashboard
2. Navigate to **Table Editor** → **orders**
3. Look for orders with:
   - Status: `paid` or `in_production`
   - `paid_at` timestamp populated
   - `print_job_id` field created

## 🔧 Troubleshooting

### **Backend Not Starting**
```bash
cd backend
npm start
```
- Check if port 4000 is available
- Verify all dependencies are installed

### **Stripe CLI Issues**
```bash
# Check Stripe CLI version
stripe --version

# Check login status
stripe config --list

# Re-login if needed
stripe login
```

### **Webhook Processing Errors**
- Check backend console for specific error messages
- Verify webhook signature validation is properly configured
- Ensure database connection is working

### **Database Update Issues**
- Verify Supabase connection
- Check RLS (Row Level Security) policies
- Ensure migration `003_add_print_job_columns.sql` was applied

## 📋 Verification Checklist

- [ ] Backend running on port 4000
- [ ] Stripe CLI forwarding webhooks
- [ ] Health check returns `{"status":"OK"}`
- [ ] Mock webhook test passes
- [ ] Real Stripe webhook trigger succeeds
- [ ] Backend logs show webhook processing
- [ ] Database shows updated order status
- [ ] Print job created successfully

## 🎯 Current System Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Order Creation** | ✅ Working | Creates orders in database |
| **Payment Intent** | ✅ Working | Generates Stripe PaymentIntent |
| **Webhook Processing** | ✅ Working | Handles real Stripe webhooks |
| **Database Updates** | ✅ Working | Updates order status automatically |
| **Print Job Creation** | ✅ Working | Creates mock print jobs |
| **Error Handling** | ✅ Working | Graceful error management |

## 🚀 Next Steps

After successful verification:

1. **Frontend Integration** - Connect UI to complete user experience
2. **Real Print Service** - Replace mock with actual printing service
3. **Production Deployment** - Deploy to production environment
4. **Monitoring Setup** - Add logging and monitoring

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend console logs for specific errors
3. Verify all prerequisites are met
4. Ensure database migrations are applied

---

**Last Updated**: January 2024  
**Version**: 1.0  
**Status**: ✅ Verified Working 