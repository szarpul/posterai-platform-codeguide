# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PosterAI is a web platform where users create AI-generated posters through a structured questionnaire (style, theme, mood, color palette, subject) instead of free-form prompts. Users can save drafts, customize print options (size, material, finish), pay via Stripe/PayPal, and have posters printed and shipped.

## Development Commands

### Frontend (React)

```powershell
cd frontend
npm install        # Install dependencies
npm start          # Start dev server (http://localhost:3000)
npm test           # Run tests
npm run build      # Production build
```

### Backend (Node.js/Express)

```powershell
cd backend
npm install        # Install dependencies
npm run dev        # Start with nodemon (http://localhost:4000)
npm start          # Start production server
npm test           # Run Jest tests
npm run lint       # ESLint check
npm run lint:fix   # Auto-fix ESLint issues
```

### Root Level

```powershell
npm run start             # Starts backend
npm run install:backend   # Install backend deps
npm run precommit         # lint-staged
```

**Note**: This project uses PowerShell. Use semicolons (`;`) not `&&` to chain commands.

## Architecture

### Monorepo Structure

- `frontend/` - React 18 SPA with React Router 6 and Tailwind CSS
- `backend/` - Node.js/Express REST API
- `supabase/` - Database migrations and config
- `openspec/` - Spec-driven development system for change proposals

### Frontend (`frontend/src/`)

- `pages/` - Route components (HomePage, QuestionnairePage, CheckoutPage, DraftsPage, OrdersPage)
- `components/` - Reusable UI (Header, Layout, ErrorBoundary, ui/)
- `contexts/` - React Context providers
- `services/` - API client functions
- `lib/` - Utility functions
- `config/` - Configuration (Supabase client setup)

### Backend (`backend/src/`)

- `routes/` - Express route handlers (drafts, images, orders, questionnaire, email, webhooks)
- `services/` - Business logic (imageGenerator, emailService, orderProcessor, printingManager, receiptService)
- `middleware/` - Express middleware
- `db/` - Database utilities
- `lib/` - Shared utilities
- `templates/` - Email templates
- `config/` - Server configuration

### Data Flow

1. Frontend calls backend REST API endpoints
2. Backend uses Supabase for database (PostgreSQL) and storage
3. Image generation uses OpenAI API (or Leonardo AI) or stub for development
4. Payments processed via Stripe/PayPal webhooks
5. Email notifications via Resend (or Gmail SMTP fallback)

## Key Technical Decisions

- **Database**: Supabase (PostgreSQL) for users, drafts, orders, product options
- **Image Generation**: OpenAI API primary, Leonardo AI alternative. Set `USE_STUB_IMAGE_GENERATION=true` for dev without API costs
- **Payments**: Stripe Elements for PCI compliance, PayPal REST API
- **Authentication**: Supabase Auth (email/password + OAuth for Google/Facebook)
- **Routing**: React Router 6 with `createBrowserRouter` pattern

## Environment Variables

### Frontend (`.env`)

```
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
```

### Backend (`.env`)

```
PORT=4000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EMAIL_VENDOR=resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=
USE_STUB_IMAGE_GENERATION=true
```

## OpenSpec Change Management

This project uses OpenSpec for spec-driven development. For significant changes:

1. Read `openspec/AGENTS.md` for workflow instructions
2. Create proposals in `openspec/changes/<change-id>/` with:
   - `proposal.md` - Why and what changes
   - `tasks.md` - Implementation checklist
   - `specs/` - Delta specifications
3. Validate with `openspec validate <change-id> --strict`

Skip proposals for: bug fixes, typos, dependency updates, config changes.

## Testing

- Backend: Jest with supertest (`npm test` in `backend/`)
- Frontend: React Testing Library (`npm test` in `frontend/`)
- E2E guide: `E2E_TESTING_GUIDE.md`
- Backend API testing: `backend/TESTING_README.md`

## Deployment

- **Frontend**: Vercel (see `VERCEL_DEPLOYMENT_GUIDE.md`)
- **Backend**: Railway (see `RAILWAY_DEPLOYMENT_GUIDE.md`)
- Pre-deploy checklist: `DEPLOYMENT_CHECKLIST.md`
