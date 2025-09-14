# 🚀 Railway Deployment - Quick Guide

## Deploy in 3 Steps

### 1. **Connect to Railway**
- Go to [railway.app](https://railway.app)
- Create new project → Deploy from GitHub
- Select your repository

### 2. **Add Environment Variables**
In Railway dashboard → Variables tab:

```bash
OPENAI_API_KEY=your_production_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
STRIPE_SECRET_KEY=your_stripe_key
PRODIGI_API_KEY=your_prodigi_key
NODE_ENV=production
USE_STUB_IMAGE_GENERATION=false
```

### 3. **Deploy**
- Push to GitHub: `git push origin main`
- Railway auto-deploys
- Test: `https://your-app.railway.app/health`

## ✅ Your Backend is Ready
- ✅ Port configured (`process.env.PORT || 4000`)
- ✅ Railway config files added
- ✅ Start script ready (`npm start`)

## 🔧 Files Added
- `railway.json` - Railway configuration
- `Procfile` - Process definition
- `backend/railway.json` - Backend config

## 🧪 Test Deployment
```bash
# Health check
curl https://your-app.railway.app/health

# API test
curl https://your-app.railway.app/api/questionnaire/options
```

**That's it! Your backend will be live in minutes.** 🎉
