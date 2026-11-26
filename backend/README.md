# Pulse CRM — REST API Backend

Production-quality enterprise REST API backend for Pulse CRM built with Node.js 20, Express, TypeScript (strict mode), PostgreSQL, Prisma ORM, JWT authentication, and RBAC authorization.

---

## 🌟 Highlights & Tech Stack

- **Runtime & Framework**: Node.js 20, Express 4.x, TypeScript strict mode
- **Database & ORM**: PostgreSQL with Prisma ORM 5.x, UUID keys, soft deletes (`deletedAt`), indexed lookup fields
- **Validation**: Zod schema validation on every route (body, query, params)
- **Authentication**: JWT access token (15m expiry) + HTTP-only secure cookie refresh token (7d expiry, SHA-256 hashed in DB with rotation on every use)
- **Security**: Bcrypt password hashing (cost 12), account lockout after 5 failed attempts (15m lockout), Helmet headers, CORS configurable origins, Express Rate Limiter
- **Architecture**: Strict 4-layer architecture:
  `Routes -> Controllers -> Services -> Repositories`
- **Real-time Delivery**: Server-Sent Events (SSE) stream for instant notifications
- **API Documentation**: OpenAPI 3.0 / Swagger UI live at `/api/docs`
- **Automation Runner**: Background automation worker (node-cron) executing rules (round-robin lead assignment, automated task creation)
- **Testing**: 25 Vitest + Supertest integration tests covering Auth, RBAC, Contacts, Deals stage history, and atomic Lead conversion

---

## 🏗 Project Architecture

```
backend/
├── Dockerfile                  # Production container definition
├── docker-compose.yml          # Multi-container stack (api, postgres 16, redis 7)
├── .env.example                # Template environment variables
├── package.json                # Dependencies and scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vitest.config.ts            # Integration test runner config
├── prisma/
│   ├── schema.prisma           # Prisma data models, relations & indexes
│   ├── seed.ts                 # Database seeder (50+ contacts, 30+ leads, 20+ deals)
│   └── migrations/
│       └── 20261123000000_init/ # Baseline PostgreSQL migration
├── src/
│   ├── server.ts               # HTTP server bootstrap & graceful shutdown
│   ├── app.ts                  # Express app setup, security middlewares, routing
│   ├── config/
│   │   ├── env.ts              # Zod-validated environment config
│   │   └── logger.ts           # Pino structured logger
│   ├── lib/
│   │   ├── prisma.ts           # PrismaClient instance with health check
│   │   ├── mailer.ts           # Nodemailer transport
│   │   └── redis.ts            # Redis / memory token blacklist & cache
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # JWT verification & user injection
│   │   ├── rbac.middleware.ts  # Role authorization (ADMIN, MANAGER, SALES_REP) & ownership
│   │   ├── error.middleware.ts # Global error handler with AppError and Prisma mapping
│   │   ├── validate.middleware.ts # Generic Zod request validator
│   │   ├── rateLimiter.middleware.ts # General & Auth rate limiters
│   │   └── auditLog.middleware.ts # Audit log tracking
│   ├── utils/
│   │   ├── AppError.ts         # Operational error class
│   │   ├── jwt.ts              # Access/refresh token generation & hashing
│   │   ├── password.ts         # Bcrypt hash (cost 12) & compare
│   │   ├── csv.ts              # CSV export & streaming parser
│   │   └── sse.ts              # Server-Sent Events client manager
│   ├── docs/
│   │   └── swagger.ts          # OpenAPI specification & Swagger UI
│   ├── data/
│   │   └── seedData.ts         # Comprehensive seed dataset (55 contacts, 35 leads, 25 deals)
│   ├── repositories/           # Data access layer (Prisma + high-fidelity fallback)
│   └── modules/                # Feature modules (routes, controllers, services, schemas)
│       ├── auth/               # Login, register, refresh, logout, password reset
│       ├── users/              # Admin user management & profile update
│       ├── contacts/           # Contact CRUD, search, filter, bulk delete, CSV import/export
│       ├── leads/              # Lead CRUD, auto scoring, atomic conversion
│       ├── deals/              # Deals CRUD, stage move, pipeline summary
│       ├── tasks/              # Task CRUD, calendar events endpoint
│       ├── activities/         # Log calls, emails, notes, meetings
│       ├── tickets/            # Support tickets, threaded comments (isInternal)
│       ├── marketing/          # Campaigns CRUD, segments, campaign stats
│       ├── automation/         # Automation rule builder & worker runner
│       ├── dashboard/          # KPI metrics, sales trend, pipeline funnel
│       ├── reports/            # Sales rep performance, forecast, CSV export
│       ├── notifications/      # Notification list, mark read, SSE stream
│       └── search/             # Ctrl+K global search
└── tests/
    ├── setup.ts                # Test lifecycle & store reset
    ├── auth.test.ts            # Auth integration tests
    ├── rbac.test.ts            # RBAC permission tests
    ├── contacts.test.ts        # Contacts CRUD, pagination, CSV tests
    ├── deals.test.ts           # Deals stage transition tests
    └── leads.test.ts           # Atomic lead conversion tests
```

---

## 🔑 Demo User Credentials

The database is seeded with 3 realistic demo accounts covering each role:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@pulsecrm.com` | `password123` | Full access: user management, global settings, audit logs, all deals/leads |
| **Manager** | `manager@pulsecrm.com` | `password123` | Team management: view all team deals, leads, tasks, reports & pipeline |
| **Sales Rep** | `sales@pulsecrm.com` | `password123` | Individual access: restricted to own assigned leads, deals, and tasks |

---

## 🚀 Quickstart & Setup

### Option 1: Docker Compose (Recommended for Full Production Stack)

Run the API, PostgreSQL 16, and Redis 7 in containers:

```bash
cd backend
docker-compose up --build -d
```

This automatically:
1. Boots PostgreSQL and Redis containers with persistent volumes and healthchecks.
2. Runs Prisma migrations (`npx prisma migrate deploy`).
3. Seeds the database with demo accounts and data (`npm run prisma:seed`).
4. Starts the API server at `http://localhost:5000`.

### Option 2: Local Development

#### 1. Install Dependencies
```bash
cd backend
npm install
```

#### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment variables:
```ini
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pulse_crm?schema=public
JWT_ACCESS_SECRET=super_secret_jwt_access_key_pulse_crm_2026_secure
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_pulse_crm_2026_secure
FRONTEND_URL=http://localhost:5173
```

#### 3. Run Prisma Migrations & Seed (When PostgreSQL is running)
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

*Note: If PostgreSQL is not yet running on your host, the backend automatically operates with an in-memory database store seeded with the full dataset, allowing instant local testing and development.*

#### 4. Start the Server
```bash
# Development (with hot-reload)
npm run dev

# Or build and run production
npm run build
npm start
```

---

## 🧪 Running Integration Tests

Run the complete Vitest + Supertest integration test suite:

```bash
cd backend
npm test
```

All 25 integration tests run in parallel and test:
- JWT login, registration, token refresh, account lockout
- RBAC permissions (Sales Rep blocked from Admin endpoints)
- Contact pagination, multi-field search, CSV export, bulk delete
- Deal stage move and stage history tracking
- Lead automatic score calculation and atomic conversion into Contact + Deal

---

## 🔗 Connecting the Frontend to the Real Backend

The React CRM frontend in the root directory can be seamlessly switched from MSW mock mode to the real Node.js Express backend:

1. In the root directory (`pulse-crm/`), open `.env`:
   ```ini
   VITE_USE_MSW=false
   VITE_API_URL=/api
   ```
2. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. Vite automatically proxies `/api` requests to `http://localhost:5000` with `changeOrigin: true`.
5. Open `http://localhost:5173` and log in with any of the demo credentials.

---

## 📚 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Service health status | No |
| `GET` | `/api/docs` | Swagger UI documentation | No |
| `POST` | `/api/auth/register` | Register new user | No (Rate limited) |
| `POST` | `/api/auth/login` | Log in and receive access/refresh tokens | No (Rate limited, lockout on 5 fails) |
| `POST` | `/api/auth/refresh` | Rotate and issue new tokens | No (Cookie or body) |
| `POST` | `/api/auth/logout` | Revoke refresh token | No |
| `POST` | `/api/auth/forgot-password` | Send password reset token email | No |
| `POST` | `/api/auth/reset-password` | Reset password using token | No |
| `GET` | `/api/auth/me` | Current authenticated user profile | Yes |
| `GET` | `/api/users` | List users | Yes (Admin, Manager) |
| `POST` | `/api/users` | Create user | Yes (Admin only) |
| `PATCH` | `/api/users/:id` | Update user | Yes |
| `DELETE` | `/api/users/:id` | Delete user | Yes (Admin only) |
| `GET` | `/api/contacts` | Paginated contacts with filters & search | Yes |
| `GET` | `/api/contacts/:id` | Get contact by ID | Yes |
| `POST` | `/api/contacts` | Create contact | Yes |
| `PATCH` | `/api/contacts/:id` | Update contact | Yes |
| `DELETE` | `/api/contacts/:id` | Soft delete contact | Yes |
| `POST` | `/api/contacts/bulk-delete` | Bulk soft delete contacts | Yes |
| `GET` | `/api/contacts/export` | Download contacts as CSV | Yes |
| `POST` | `/api/contacts/import` | Upload & validate contacts from CSV | Yes |
| `GET` | `/api/contacts/:id/timeline` | Aggregated timeline for contact | Yes |
| `GET` | `/api/leads` | List leads (filtered by owner for Sales Rep) | Yes |
| `POST` | `/api/leads` | Create lead (auto score calculated) | Yes |
| `PATCH` | `/api/leads/:id` | Update lead & recalculate score | Yes |
| `DELETE` | `/api/leads/:id` | Soft delete lead | Yes |
| `POST` | `/api/leads/:id/convert` | Atomic transaction to convert Lead -> Contact + Deal | Yes |
| `GET` | `/api/deals` | List deals | Yes |
| `POST` | `/api/deals` | Create deal | Yes |
| `PATCH` | `/api/deals/:id` | Move deal stage (records DealStageHistory) | Yes |
| `DELETE` | `/api/deals/:id` | Soft delete deal | Yes |
| `GET` | `/api/deals/pipeline-summary` | Aggregate deal value and count per stage | Yes |
| `GET` | `/api/tasks` | List tasks with date/status filters | Yes |
| `GET` | `/api/tasks/calendar` | Calendar formatted events | Yes |
| `POST` | `/api/tasks` | Create task | Yes |
| `PATCH` | `/api/tasks/:id` | Update task status or priority | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes |
| `GET` | `/api/activities` | List contact activities | Yes |
| `POST` | `/api/activities` | Log call, email, note, or meeting | Yes |
| `GET` | `/api/tickets` | List support tickets | Yes |
| `GET` | `/api/tickets/:id` | Get ticket with threaded comments | Yes |
| `POST` | `/api/tickets` | Create support ticket | Yes |
| `PATCH` | `/api/tickets/:id` | Update ticket status or priority | Yes |
| `POST` | `/api/tickets/:id/comments` | Add comment (supports isInternal flag) | Yes |
| `GET` | `/api/campaigns` | List marketing campaigns | Yes |
| `POST` | `/api/campaigns` | Create marketing campaign | Yes |
| `GET` | `/api/campaigns/segments` | List audience segments | Yes |
| `GET` | `/api/automations` | List automation rules | Yes |
| `POST` | `/api/automations` | Create automation rule | Yes |
| `PATCH` | `/api/automations/:id` | Toggle enable or update rule | Yes |
| `DELETE` | `/api/automations/:id` | Delete automation rule | Yes |
| `GET` | `/api/dashboard/metrics` | Dashboard KPI metrics & trend charts | Yes |
| `GET` | `/api/reports/reps` | Sales rep quota attainment report | Yes |
| `GET` | `/api/reports/conversion` | Lead-to-deal conversion report | Yes |
| `GET` | `/api/reports/forecast` | Weighted pipeline revenue forecast | Yes |
| `GET` | `/api/reports/export` | Download sales reports as CSV | Yes |
| `GET` | `/api/notifications` | List user notifications | Yes |
| `PATCH` | `/api/notifications/:id/read`| Mark notification as read | Yes |
| `POST` | `/api/notifications/read-all`| Mark all notifications as read | Yes |
| `GET` | `/api/notifications/stream` | Server-Sent Events (SSE) live stream | Yes |
| `GET` | `/api/search` | Command palette multi-entity search (Ctrl+K) | Yes |
| `POST` | `/api/reset-db` | Reset database to seed baseline | Yes |
