# PosterAI Platform

A web platform for creating and ordering AI-generated posters.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account (for payments)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd posterai-platform
```

2. Frontend Setup:
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory with:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Backend Setup:
```bash
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
USE_STUB_IMAGE_GENERATION=true  # Set to 'true' to use stubbed image generation instead of OpenAI
```

4. Start the Development Servers:

In one terminal (frontend):
```bash
cd frontend
npm start
```

In another terminal (backend):
```bash
cd backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

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