# Pulse CRM | Modern Enterprise Customer Relationship Management

A production-grade, dynamic CRM web application built with **React 18**, **Vite**, **TypeScript (Strict Mode)**, **Tailwind CSS**, and **shadcn/ui (Radix primitives)**. Powered by an offline-ready **MSW (Mock Service Worker)** backend with realistic seeded business data, state persistence, and a decoupled API layer ready for instant live backend substitution.

---

## 🌟 Key Features

### 1. Executive Intelligence Dashboard
- **KPI Metrics**: Real-time revenue velocity, new lead count, won deals, and open tickets with period change badges (% vs prior period).
- **Date Range Filters**: Updates all metrics and charts dynamically across `Today`, `7 Days`, `30 Days`, `Quarter`, and `This Year`.
- **Visual Analytics**:
  - Recharts Area chart for Revenue vs Quota Target.
  - Funnel breakdown across sales pipeline stages.
  - Donut chart tracking leads by acquisition source (Organic, Referral, LinkedIn, Outbound, Conference).
- **Today's Priorities**: Real-time task checklist with overdue warning indicators and instant toggle check-off.
- **Recent Activity Feed**: Chronological log of sales calls, emails, demos, and note touchpoints.

### 2. Contacts Directory & Detail Intelligence
- **High-Performance Table**: Server-style pagination, instant search, multi-column sorting, status filters, and source filters.
- **Bulk Operations**: Multi-row selection, bulk deletion with safety confirmation dialog, and CSV export.
- **Side Drawer**: Create or edit contacts with React Hook Form + Zod validation.
- **CSV Import Engine**: Drag-and-drop CSV importer with auto-column mapping and instant preview.
- **Contact Detail View** (`/contacts/:id`):
  - Comprehensive customer dossier and company metadata.
  - Timeline of calls, emails, notes, and meeting summaries with "Log Activity" modal.
  - Linked active pipeline deals and scheduled follow-up tasks.

### 3. Inbound Leads & Opportunity Conversion
- **Lead Qualification**: Tracking status (`New`, `Contacted`, `Qualified`, `Disqualified`) and acquisition channels.
- **Visual Scoring Badges**:
  - 🔥 **Hot** ($\ge 75$): High-intent prospects with flame badge.
  - ☀️ **Warm** ($40 - 74$): Developing opportunities.
  - ❄️ **Cold** ($< 40$): Low engagement / nurture pool.
- **Inline Account Owner Reassignment**: Reassign reps directly from the list with instant persistence.
- **1-Click Deal Conversion**: Converts qualified lead into an Account Contact and automatically initializes an Opportunity Deal in the Kanban pipeline with celebratory confetti!

### 4. Deals Pipeline Kanban Board
- **Stages**: `New Opportunities` ➔ `Contacted` ➔ `Proposal Sent` ➔ `Negotiation` ➔ `Closed Won` / `Closed Lost`.
- **Drag & Drop**: Powered by `@dnd-kit/core` with smooth animations, custom drag overlay, and **optimistic state updates**.
- **Stage Totals**: Column headers automatically calculate deal counts and aggregate pipeline dollar values.
- **Celebration Effect**: Dragging deals into the `Closed Won` column triggers confetti animation!
- **Deal Modal**: Manage deal size, probability %, target close dates, sales owner, priority, and notes.

### 5. Tasks & Interactive Calendar
- **Triple-View Switcher**:
  - **List View**: Prioritized checklist with overdue tags and quick complete toggle.
  - **Month Calendar**: Full month interactive calendar grid with task chips and "+" creation shortcuts on any date.
  - **Week Calendar**: 7-day column schedule view.
- **Overdue Detection**: Highlights tasks past their scheduled due date.

### 6. Support Tickets & Case Management
- **Ticket Tracking**: Ticket numbers (`TICK-1042`), priority levels (`Urgent`, `High`, `Medium`, `Low`), and lifecycle status (`Open`, `Pending`, `Resolved`, `Closed`).
- **Ticket Detail Drawer**:
  - Full client conversation and communication history.
  - **Internal Notes Toggle**: Private internal notes with distinct yellow styling, visible only to internal team members.

### 7. Marketing & Email Campaigns
- **Audience Segmentation**: Segments for `All Qualified Leads`, `Hot Leads`, `Existing Customers`, and `Inactive > 30 Days`.
- **Campaign Wizard**: Create email blasts with immediate send simulation or scheduled delivery.
- **Engagement Analytics**: Delivery volume, open rate %, and click-through % charts.

### 8. Workflow Automation Engine
- **Visual 3-Step Rule Builder**:
  1. `WHEN` (Trigger event: Lead Created, Deal Won, Ticket Opened, Stage Advanced)
  2. `IF` (Condition threshold: Score, Deal Value, Priority)
  3. `THEN` (Action: Assign Owner, Create Task, Send Alert)
- **Active Toggle Switch**: Pause or activate rules in real-time with execution counters.

### 9. Sales Reports & Quota Attainment
- **Attainment Leaderboard**: Performance by sales representative (Quota Target, Closed Revenue, % Attainment bar, Win Rate %).
- **Cumulative Forecast Model**: Projected revenue curve vs historical actuals.
- **Stage Conversion Velocity**: Funnel pass-through percentages benchmarked against industry standards.
- **Exporting**: 1-click export to CSV and printable report view.

### 10. Global Enterprise Features
- **Global Command Palette (`Ctrl+K` / `Cmd+K`)**: Instant search across contacts, deals, tickets, and quick navigation routes.
- **Live Notifications Dropdown**: Alerts on closed deals, urgent tickets, and overdue reminders with mark-read capability.
- **Dark Mode / Light Mode**: Custom blue & soft blue-gray theme (`#2563EB` primary accent, `#F8FAFC` slate background) with persistent preference.
- **Responsive Architecture**: Collapsible sidebar, mobile bottom navigation bar, slide-out drawer, and responsive cards for smaller screens.

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

Pulse CRM enforces role-based access control with multi-tab synchronization and simulated JWT token auto-refresh:

| Role | Permissions & Visible Modules |
| :--- | :--- |
| **Admin** | Full access to all CRM modules, including **Settings** and **User Management**. Can invite team members, adjust roles, and reset databases. |
| **Manager** | Pipeline oversight, lead assignment, team performance reports, automations, and campaigns. Cannot edit org-level system settings. |
| **Sales Rep** | Manages assigned leads, contacts, deals, tasks, activities, and tickets. Restricted from admin configurations. |

### Demo Credentials (Pre-Seeded)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@pulsecrm.com` | `password123` |
| **Manager** | `manager@pulsecrm.com` | `password123` |
| **Sales Rep** | `sales@pulsecrm.com` | `password123` |

> 💡 **Quick Sign-In**: The Login page includes one-click demo pill buttons to sign in as Admin, Manager, or Sales Rep instantly. You can also switch roles live at any time using the user profile menu dropdown in the top navigation bar!

---

## 📂 Project Structure

```
pulse-crm/
├── e2e/                             # Playwright E2E tests
│   └── login.spec.ts                # Login flow & validation test
├── public/
│   └── mockServiceWorker.js         # MSW browser service worker
├── src/
│   ├── features/                    # Feature-driven modular architecture
│   │   ├── auth/                    # Login, Register, Forgot/Reset Password, Auth Store
│   │   ├── layout/                  # Sidebar, Header, Breadcrumbs, Notifications, UserMenu
│   │   ├── dashboard/               # KPI cards, Revenue line chart, Pipeline funnel, Donut
│   │   ├── contacts/                # Contacts table, side drawer, CSV modal, timeline
│   │   ├── leads/                   # Leads list, scoring badges, conversion modal
│   │   ├── deals/                   # Kanban board, columns, deal cards, deal modal
│   │   ├── tasks/                   # Task list, Month calendar, Week calendar, modal
│   │   ├── tickets/                 # Ticket table, detail drawer, internal note thread
│   │   ├── marketing/               # Campaign list, audience segments, engagement chart
│   │   ├── automation/              # Visual 3-step rule builder, execution counts
│   │   ├── reports/                 # Rep attainment table, forecast curve, CSV export
│   │   └── settings/                # User management (admin), mock database controls
│   ├── lib/
│   │   ├── api/
│   │   │   ├── axios.ts             # Axios client with JWT refresh & BroadcastChannel sync
│   │   │   └── types.ts             # Strict TypeScript domain interfaces and DTOs
│   │   └── mocks/
│   │       ├── db.ts                # Stateful mock database with localStorage persistence
│   │       ├── handlers.ts          # MSW request handlers (auth, CRM, metrics, search)
│   │       ├── browser.ts           # Browser worker setup
│   │       ├── server.ts            # Node worker setup for unit tests
│   │       └── seedData.ts          # Realistic fixtures (25+ accounts, leads, deals)
│   ├── routes/
│   │   ├── AppRoutes.tsx            # Lazy-loaded route registry
│   │   ├── ProtectedRoute.tsx       # Auth session guard
│   │   └── RoleGate.tsx             # RBAC role authorization guard
│   ├── shared/
│   │   ├── hooks/                   # usePermissions, useTheme, useDebounce, useMediaQuery
│   │   └── ui/                      # shadcn/ui Radix primitives (Button, Drawer, Dialog, etc.)
│   ├── utils/
│   │   ├── cn.ts                    # Tailwind CSS class merging
│   │   ├── formatters.ts            # Currency, compact numbers, relative timestamps
│   │   └── export.ts                # CSV generator and file parser
│   ├── test/                        # Vitest test suites & test environment setup
│   ├── App.tsx                      # Root App component with QueryClient
│   ├── main.tsx                     # Entrypoint with MSW worker bootstrapping
│   └── index.css                    # Tailwind CSS variables & custom scrollbars
├── playwright.config.ts             # Playwright E2E configuration
├── tailwind.config.js               # Theme styling (#2563EB primary, 12px border radius)
├── tsconfig.json                    # Strict TypeScript configuration with @/ alias
└── vite.config.ts                   # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v22+ recommended)
- **npm**: v9.0.0 or later

### Installation & Run

1. Clone or navigate into the project directory:
   ```bash
   cd pulse-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

### Unit & Integration Tests (Vitest + React Testing Library)
Run the 13 automated unit tests covering auth state, permissions, formatting, CSV parsing, and Kanban logic:
```bash
npm run test
```

### End-to-End Tests (Playwright)
Run the Playwright E2E browser tests:
```bash
npm run test:e2e
```

---

## 🔌 Production REST API Backend

A complete production-grade Node.js 20 + Express + TypeScript + PostgreSQL + Prisma ORM REST API is available in `backend/`.

### Run Backend via Docker Compose (Recommended)
```bash
cd backend
docker-compose up --build -d
```
This starts PostgreSQL 16, Redis 7, runs Prisma migrations, seeds the database, and serves the API at `http://localhost:5000` with Swagger docs at `http://localhost:5000/api/docs`.

### Run Backend Locally
```bash
cd backend
npm install
npm run dev
```

### Connect Frontend to Backend
1. In the frontend root directory (`pulse-crm/`), open `.env`:
   ```env
   VITE_USE_MSW=false
   VITE_API_URL=/api
   ```
2. Start the backend: `cd backend && npm run dev`
3. Start the frontend: `npm run dev`
4. The Vite development server automatically proxies `/api` requests to `http://localhost:5000`.
5. Access Swagger API documentation at [http://localhost:5000/api/docs](http://localhost:5000/api/docs).

For in-depth backend details, architecture diagrams, and complete endpoint listings, see the [Backend Documentation](file:///C:/Users/user/.gemini/antigravity/scratch/pulse-crm/backend/README.md).
