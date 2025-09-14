# ✅ Railway Deployment Checklist

## Pre-Deployment Checklist

### **Code Preparation**
- [ ] All code committed to GitHub
- [ ] ESLint errors fixed
- [ ] Security issues resolved (no exposed API keys)
- [ ] Railway configuration files added (`railway.json`, `Procfile`)

### **Environment Variables Ready**
- [ ] OpenAI API key (production)
- [ ] Supabase URL and service role key
- [ ] Stripe secret key (production)
- [ ] Stripe webhook secret
- [ ] PayPal client ID and secret (if using)
- [ ] Prodigi API key (production)
- [ ] Prodigi webhook secret

### **Railway Setup**
- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Project created in Railway
- [ ] Environment variables configured

## Deployment Steps

### **1. Railway Configuration**
- [ ] Connect GitHub repository
- [ ] Select main branch
- [ ] Configure build settings (auto-detected)

### **2. Environment Variables**
- [ ] Add all required environment variables
- [ ] Set `NODE_ENV=production`
- [ ] Set `USE_STUB_IMAGE_GENERATION=false`
- [ ] Verify all API keys are production keys

### **3. Deploy**
- [ ] Trigger initial deployment
- [ ] Monitor build logs
- [ ] Wait for deployment to complete

### **4. Testing**
- [ ] Test health endpoint: `GET /health`
- [ ] Test API endpoints
- [ ] Test webhook endpoints
- [ ] Verify database connections

### **5. Frontend Update**
- [ ] Update frontend API URL to Railway URL
- [ ] Test frontend-backend integration
- [ ] Update webhook URLs in Stripe/PayPal

## Post-Deployment Verification

### **API Testing**
```bash
# Health check
curl https://your-app.railway.app/health

# Questionnaire options
curl https://your-app.railway.app/api/questionnaire/options

# Test webhook
curl -X POST https://your-app.railway.app/api/orders/webhook \
     -H "Content-Type: application/json" \
     -d '{"type":"test"}'
```

### **External Service Updates**
- [ ] Update Stripe webhook URL
- [ ] Update PayPal webhook URL (if using)
- [ ] Update Prodigi webhook URL (if using)
- [ ] Test webhook delivery

### **Monitoring Setup**
- [ ] Check Railway logs for errors
- [ ] Set up monitoring alerts
- [ ] Test error handling
- [ ] Verify performance metrics

## Quick Commands

### **Railway CLI (Optional)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs

# Check status
railway status
```

### **Manual Deployment**
1. Push to GitHub: `git push origin main`
2. Railway auto-deploys
3. Check Railway dashboard for status

## Troubleshooting

### **Common Issues**
- **Build fails**: Check Node.js version and dependencies
- **App crashes**: Check environment variables and logs
- **Database errors**: Verify Supabase connection
- **Webhook fails**: Check webhook URL and signatures

### **Debug Steps**
1. Check Railway logs
2. Verify environment variables
3. Test API endpoints individually
4. Check external service connections

---

**🎯 Ready to deploy? Follow the Railway Deployment Guide!**
