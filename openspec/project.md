# Project Context

## Purpose

PosterAI Platform is a web application that enables users to create and order custom AI-generated posters without requiring design skills or complex prompt engineering. Users complete a structured questionnaire (style, theme, mood, color palette, subject), and the system generates unique poster images using external text-to-image APIs (OpenAI or Leonardo AI). Users can save drafts, customize poster size and finish, complete secure checkout via Stripe or PayPal, and have posters printed and shipped through external printing partners.

**Key Goals:**

- Remove barriers to creating AI-generated art through structured questionnaires
- Streamline the end-to-end process from digital creation to physical product delivery
- Support multiple AI image generation providers (pluggable architecture)
- Enable secure payment processing and order fulfillment
- Provide admin dashboard for order management and template library management

## Tech Stack

### Frontend

- **React** 18.2.0 - Component-based UI framework with Hooks
- **React Router** 6.11.2 - Client-side routing with `createBrowserRouter` pattern
- **Tailwind CSS** 3.4.0 - Utility-first CSS framework
- **Axios** 1.6.0 - HTTP client for API calls
- **Supabase Client** 2.35.0 - Authentication and database client
- **Stripe.js** 2.4.0 - Payment processing frontend SDK
- **Framer Motion** 12.23.12 - Animation library
- **React Testing Library** - Component testing utilities

### Backend

- **Node.js** >=16.0.0 - JavaScript runtime
- **Express.js** 4.18.2 - Web framework with RESTful API design
- **Supabase** 2.35.0 - Backend-as-a-service (PostgreSQL database, auth, storage)
- **OpenAI** 4.11.0 - OpenAI Image API integration
- **Leonardo AI SDK** 4.20.0 - Leonardo AI image generation integration
- **Stripe** 12.14.0 - Payment processing backend SDK
- **PayPal REST SDK** 1.8.1 - PayPal payment integration
- **Resend** 6.1.1 - Email service (primary)
- **Nodemailer** 7.0.6 - SMTP email service (Gmail fallback)
- **Jest** 29.7.0 - Testing framework
- **Supertest** 6.3.3 - HTTP assertion library

### Infrastructure & Tools

- **Supabase** - Database (PostgreSQL), authentication, storage
- **GitHub** - Version control and CI/CD
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

## Project Conventions

### Code Style

**Formatting:**

- Single quotes for strings (Prettier config)
- Semicolons required
- 2-space indentation (tabs converted to spaces)
- CRLF line endings (`endOfLine: "crlf"`)
- 100 character print width
- Trailing commas (ES5 style)

**Naming Conventions:**

- **Files**: PascalCase for React components (`.jsx`), camelCase for utilities (`.js`)
- **Components**: PascalCase (e.g., `QuestionnairePage.jsx`, `Header.jsx`)
- **Functions/Variables**: camelCase (e.g., `generateImage`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Routes**: kebab-case URLs (e.g., `/forgot-password`, `/order-success`)
- **Database tables**: snake_case (e.g., `questionnaire_options`, `user_id`)

**ESLint Rules:**

- Unused variables prefixed with `_` are ignored (e.g., `_next`, `_req`)
- Console statements allowed in backend (development/debugging)
- Strict mode enabled (no-undef, no-unused-vars)
- React-specific rules via `react-app` preset in frontend

**File Organization:**

- Backend: `backend/src/` with subdirectories: `routes/`, `services/`, `lib/`, `middleware/`, `db/`, `config/`, `templates/`, `utils/`
- Frontend: `frontend/src/` with subdirectories: `pages/`, `components/`, `contexts/`, `lib/`, `services/`, `config/`
- Shared UI components in `components/ui/`
- Feature-specific components in `components/` or alongside pages

### Architecture Patterns

**Backend Architecture (Layered):**

1. **Routes Layer** (`routes/`) - HTTP request handlers, input validation, response formatting
2. **Services Layer** (`services/`) - Business logic, orchestration, external API calls
3. **Library Layer** (`lib/`) - Low-level utilities, SDK wrappers, shared helpers
4. **Middleware Layer** (`middleware/`) - Authentication, error handling, request logging
5. **Database Layer** (`db/`) - SQL migrations and schema definitions

**Service Factory Pattern:**

- `ImageGeneratorFactory` - Creates image generation providers (OpenAI, Leonardo, Stub)
- `EmailServiceFactory` - Creates email vendors (Resend, Gmail)
- Allows pluggable providers without modifying consuming code

**Provider Pattern:**

- Each service provider implements a common interface (e.g., `EmailVendor`, `ImageGenerator`)
- Factory selects provider based on environment variables
- Enables easy switching between providers (e.g., `EMAIL_VENDOR=resend` vs `EMAIL_VENDOR=gmail`)

**Frontend Architecture:**

- **Page Components** (`pages/`) - Route-level components handling full page views
- **UI Components** (`components/ui/`) - Reusable, presentational components (Button, Card, Input)
- **Feature Components** (`components/`) - Domain-specific components (Header, Layout, ErrorBoundary)
- **Context Providers** (`contexts/`) - Global state management (AuthContext, QuestionnaireContext)
- **Service Layer** (`services/`) - API client wrappers (paymentService, etc.)

**Route Protection:**

- `PrivateRoute` wrapper component checks authentication via `AuthContext`
- Unauthenticated users redirected to `/login`
- Protected routes: `/questionnaire`, `/drafts`, `/checkout`, `/orders`

### Testing Strategy

**Backend Testing:**

- **Framework**: Jest with Node.js environment
- **Test Location**: `backend/tests/` directory
- **Test Files**: Mirror source structure (e.g., `routes/questionnaire.test.js`)
- **HTTP Testing**: Supertest for API endpoint testing
- **Mocking**: Jest mocks for external services (Supabase, OpenAI, Stripe)
- **Setup**: `tests/setup.js` for test environment configuration

**Frontend Testing:**

- **Framework**: Jest + React Testing Library
- **Component Testing**: Focus on user interactions and accessibility
- **Test Files**: Co-located with components or in `__tests__` directories
- **E2E Testing**: Cypress (referenced in documentation)

**Test Commands:**

- Backend: `npm test` (Jest), `npm run test:watch` (watch mode)
- Frontend: `npm test` (React Scripts test runner)

**Coverage Goals:**

- Critical paths: authentication, payment processing, order creation
- API endpoints: all routes should have request/response tests
- Business logic: service layer functions should be unit tested

### Git Workflow

**Branching Strategy:**

- `master` branch for production-ready code
- Feature branches for new development
- Pull requests required for code review

**Pre-commit Hooks (Husky + lint-staged):**

- ESLint auto-fix for backend JS files (`backend/**/*.js`)
- ESLint + Prettier for frontend JS/JSX (`frontend/src/**/*.{js,jsx}`)
- Prettier for JSON and Markdown files (`*.{json,md}`)
- Runs automatically on `git commit` to ensure code quality

**Commit Conventions:**

- Conventional commits encouraged (not strictly enforced)
- Clear, descriptive commit messages
- One logical change per commit

**File Changes:**

- Modified files tracked in git status
- `.cursor/` directory excluded from version control
- Environment files (`.env`) excluded via `.gitignore`

## Domain Context

**Core User Journey:**

1. User signs up/logs in (email/password or social OAuth)
2. User completes questionnaire (5 selections: style, theme, mood, color, subject)
3. System generates AI image via external API (OpenAI or Leonardo AI)
4. User previews image and can save as draft or proceed to customization
5. User selects poster size (A4, A3, A2), material (200gsm matte/glossy), finish (matte/glossy)
6. User enters shipping address (defaults to Poland)
7. User selects payment method (Stripe or PayPal) and completes checkout
8. System creates order, processes payment, sends print job to external printing partner
9. User receives email notifications as order status changes (In Production → Shipped)

**Questionnaire System:**

- Admin-managed options (no free-form user input)
- Options stored in `questionnaire_options` table with `type` and `value` columns
- Types: `style`, `theme`, `mood`, `color`, `subject`
- Users select one option per type to build generation prompt

**Image Generation:**

- Supports multiple providers via factory pattern
- Current providers: OpenAI DALL-E, Leonardo AI, Stub (for testing)
- Prompt constructed from questionnaire selections
- Generated images stored in Supabase Storage
- Fallback to stub provider for development/testing (`USE_STUB_IMAGE_GENERATION=true`)

**Payment Processing:**

- Stripe integration for credit card payments
- PayPal integration for PayPal account payments
- Webhook handlers for payment status updates
- Order created with `pending` status, updated to `paid` on successful payment

**Order Fulfillment:**

- External printing partner API integration (Prodigi)
- Order details (image URL, size, material, finish, shipping address) sent to printing service
- Status tracking: `pending` → `paid` → `in_production` → `shipped`
- Email notifications sent at each status change

**Email Service:**

- Primary: Resend (transactional email service)
- Fallback: Gmail SMTP (via Nodemailer)
- Email types: order confirmations, status updates, password resets
- Templates defined in `backend/src/templates/emailTemplates.js`

## Important Constraints

**Technical Constraints:**

- Node.js version >=16.0.0 required (specified in root `package.json`)
- Windows PowerShell environment (use semicolons `;` not `&&` for command chaining)
- CRLF line endings required (Windows compatibility)
- Supabase as single source of truth for database and authentication
- External API dependencies: OpenAI/Leonardo AI availability affects image generation
- Printing partner API availability affects order fulfillment

**Business Constraints:**

- Shipping limited to Poland initially (address validation and carrier setup)
- Questionnaire options must be curated by admins (no free-form user input)
- Payment processing requires active Stripe/PayPal accounts with proper credentials
- Email service requires verified sender domain (Resend) or Gmail app password

**Security Constraints:**

- Environment variables must be stored securely (never committed)
- API keys must be kept secret (use `.env` files, excluded from git)
- Supabase service role key has elevated permissions (backend only)
- JWT tokens for authentication (Supabase-managed)
- CORS configured for specific origins (localhost:3000 in dev, production URL in prod)

**Regulatory Constraints:**

- GDPR compliance for user data handling
- Payment processing must comply with PCI DSS (Stripe/PayPal handle this)
- User data export/deletion capabilities required

**Performance Constraints:**

- Image generation API response time impacts UX (target ≤5s excluding network)
- Page load time target ≤2s on 3G/4G networks
- Database queries should be optimized (connection pooling via Supabase)

## External Dependencies

**Supabase (Backend-as-a-Service):**

- PostgreSQL database for users, drafts, orders, questionnaire options
- Authentication service (email/password, OAuth providers)
- Storage service for generated poster images
- Real-time capabilities (if needed)
- Connection string format: `postgresql://[user]:[password]@[host]:[port]/[database]`

**OpenAI API:**

- Image generation via DALL-E models
- API key required (`OPENAI_API_KEY`)
- Rate limits apply (check OpenAI documentation)
- Response format: image URL or base64 encoded image

**Leonardo AI:**

- Alternative image generation provider
- SDK package: `@leonardo-ai/sdk`
- API key and configuration required
- Model selection available via SDK

**Stripe:**

- Payment processing for credit cards
- Secret key and webhook secret required
- Webhook endpoint: `/api/orders/webhook`
- Test mode keys available for development

**PayPal:**

- Payment processing for PayPal accounts
- Client ID and Client Secret required
- REST API integration (`paypal-rest-sdk` package)

**Resend (Email Service):**

- Transactional email service (primary)
- API key required (`RESEND_API_KEY`)
- From email must be verified domain or Resend account email
- Templates and HTML emails supported

**Gmail SMTP (Email Fallback):**

- SMTP server for email delivery
- Requires Gmail account with 2FA enabled
- App password (16-character) required instead of regular password
- Configured via Nodemailer

**Prodigi (Printing Partner):**

- External printing and fulfillment service
- API integration for order submission
- Status webhooks for order tracking
- Shipping address and print specifications required

**Development Dependencies:**

- Nodemon for backend auto-reload (`npm run dev`)
- React Scripts for frontend development server (`npm start`)
- ESLint and Prettier for code quality
- Jest for testing

**Production Deployment:**

- Railway (backend deployment) - see `RAILWAY_DEPLOYMENT_GUIDE.md`
- Vercel (frontend deployment) - see `VERCEL_DEPLOYMENT_GUIDE.md`
- Environment variables configured in deployment platforms
- Database migrations run via Supabase migrations or SQL scripts
