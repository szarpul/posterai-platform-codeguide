# PosterAI Platform

A web platform for creating and ordering AI-generated posters.

## ⚠️ PowerShell Command Syntax

**Important**: This project runs on Windows PowerShell. Use semicolons (`;`) to separate commands, not `&&`:

```powershell
# ✅ CORRECT PowerShell syntax
cd backend; npm install; npm start

# ❌ WRONG - this is bash syntax
cd backend && npm install && npm start

# ✅ CORRECT - with environment variables
cd backend; $env:NODE_ENV="development"; npm start

# ✅ CORRECT - multiple commands
cd frontend; npm install; npm start
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account (for payments)
- Resend account (for emails)

## Setup Instructions

1. Clone the repository:

```powershell
git clone <repository-url>
cd posterai-platform
```

2. Frontend Setup:

```powershell
cd frontend
npm install
```

Create a `.env` file in the frontend directory with:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Backend Setup:

```powershell
cd ../backend
npm install
```

Create a `.env` file in the backend directory with:

```
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Service Configuration (Resend - Default)
EMAIL_VENDOR=resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your-verified-email@domain.com

# Alternative: Gmail Configuration
# EMAIL_VENDOR=gmail
# GMAIL_USER=your-email@gmail.com
# GMAIL_FROM_EMAIL=your-email@gmail.com
# GMAIL_APP_PASSWORD=your-16-character-app-password

USE_STUB_IMAGE_GENERATION=true  # Set to 'true' to use stubbed image generation instead of OpenAI
```

4. Start the Development Servers:

In one terminal (frontend):

```powershell
cd frontend
npm start
```

In another terminal (backend):

```powershell
cd backend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Email Service Setup

### Resend Setup (Recommended)

1. **Create Resend Account**:

   - Go to [resend.com](https://resend.com) and sign up
   - Verify your email address

2. **Add Your Domain** (Optional but recommended):

   - Go to Resend Dashboard → Domains
   - Click "Add Domain" and enter your domain (e.g., `yourdomain.com`)
   - Add the required DNS records to verify domain ownership
   - Wait for verification (5-30 minutes)

3. **Generate API Key**:

   - Go to Resend Dashboard → API Keys
   - Click "Create API Key"
   - Copy the API key (starts with `re_`)

4. **Add to .env**:

   ```
   EMAIL_VENDOR=resend
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=your-verified-email@domain.com
   ```

5. **Test Email Service**:
   ```powershell
   cd backend
   node scripts/test-resend-service.js
   ```

### Alternative Email Services

#### Gmail SMTP Setup

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password (16-character code)
3. Add to .env:
   ```
   EMAIL_VENDOR=gmail
   GMAIL_USER=your-email@gmail.com
   GMAIL_FROM_EMAIL=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

## Environment Variables

### Frontend

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Backend

- `PORT`: Backend server port (default: 4000)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `OPENAI_API_KEY`: Your OpenAI API key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Your verified sender email address
- `USE_STUB_IMAGE_GENERATION`: Set to 'true' to use stubbed image generation instead of OpenAI

## Getting the Required Keys

1. Supabase:

   - Create a project at https://supabase.com
   - Get URL and keys from project settings

2. OpenAI:

   - Sign up at https://platform.openai.com
   - Get API key from account settings

3. Stripe:

   - Sign up at https://stripe.com
   - Get test keys from dashboard
   - Set up webhook for local development using Stripe CLI

4. Resend:
   - Sign up at https://resend.com
   - Generate API key from dashboard
   - Optionally add and verify custom domain
   - Test setup: `node scripts/test-resend-service.js`

## Testing

### Backend API Testing

Run the comprehensive backend test to validate all functionality:

```powershell
cd backend
node test-complete-order-flow.js
```

For detailed testing instructions, see `BACKEND_API_TESTING.md`.

### API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md`, including:

- All endpoints with request/response examples
- Authentication requirements
- Error handling
- Data models
- Testing procedures

## Project Documentation

This project maintains several types of documentation:

### Specification Changes (`.spec/`)

The `.spec/` directory contains detailed specifications for major features and system changes:

- **[INDEX.md](.spec/INDEX.md)** - Master index of all specifications
- **[README.md](.spec/README.md)** - Guide to creating and using specifications
- Individual spec files for major changes (e.g., `questionnaire-simplification.md`)

Use specifications to understand:

- Why changes were made
- How to implement/migrate changes
- How to test and verify
- How to rollback if needed

### Deployment Guides

- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment validation checklist
- `FRONTEND_DEPLOYMENT_CHECKLIST.md` - Frontend-specific deployment steps
- `RAILWAY_DEPLOYMENT_GUIDE.md` - Deploying backend to Railway
- `VERCEL_DEPLOYMENT_GUIDE.md` - Deploying frontend to Vercel

### Testing Documentation

- `E2E_TESTING_GUIDE.md` - End-to-end testing procedures
- `verifications/BACKEND_API_TESTING.md` - Backend API verification
- `backend/TESTING_README.md` - Backend unit and integration tests

### Integration Guides

- `documentation/leonardo-integration-plan.md` - Leonardo AI integration
- `frontend/PAYMENT_INTEGRATION_README.md` - Payment gateway setup
