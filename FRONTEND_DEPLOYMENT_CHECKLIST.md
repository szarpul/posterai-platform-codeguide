# ✅ Frontend Deployment Checklist

## Pre-Deployment Setup

### **1. Environment Variables**

Create `frontend/.env.local` (for local development):

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Backend API Configuration (Railway URL)
REACT_APP_API_URL=https://your-railway-app.railway.app/api
```

### **2. Update Railway CORS**

In Railway dashboard → Variables:

```bash
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

## Vercel Deployment Steps

### **1. Connect Repository**

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up/login with GitHub
- [ ] Click "New Project"
- [ ] Import your repository
- [ ] Set **Root Directory** to `frontend`

### **2. Configure Build Settings**

- [ ] Framework Preset: **Create React App**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Install Command: `npm install`

### **3. Set Environment Variables**

In Vercel dashboard → Settings → Environment Variables:

- [ ] `REACT_APP_API_URL` = `https://your-railway-app.railway.app/api`
- [ ] `REACT_APP_SUPABASE_URL` = your Supabase URL
- [ ] `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key

### **4. Deploy**

- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Test deployed frontend

## Post-Deployment Testing

### **1. Frontend Tests**

- [ ] Visit deployed URL
- [ ] Test user registration/login
- [ ] Test poster creation flow
- [ ] Test payment integration
- [ ] Test responsive design

### **2. Backend Integration**

- [ ] Verify API calls work
- [ ] Test CORS configuration
- [ ] Check webhook endpoints
- [ ] Verify database connections

### **3. External Services**

- [ ] Update Stripe webhook URL to Railway
- [ ] Update PayPal webhook URL to Railway
- [ ] Test payment flows end-to-end

## Quick Commands

### **Local Development**

```bash
# Start frontend locally
cd frontend
npm start

# Test with Railway backend
# Update REACT_APP_API_URL in .env.local
```

### **Vercel CLI (Optional)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel

# View deployments
vercel ls
```

## Troubleshooting

### **Build Failures**

- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### **Environment Variables**

- Ensure all REACT*APP* variables are set
- Check variable names match exactly
- Redeploy after adding new variables

### **API Connection Issues**

- Verify Railway backend is running
- Check CORS configuration
- Test API endpoints directly

---

**🎯 Ready to deploy your frontend to Vercel!**
