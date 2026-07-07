# PulseIQ — Real-Time Event Analytics Platform

PulseIQ is a real-time event analytics dashboard. It tracks user activity (logins, signups, purchases, searches, logouts, API errors) and visualizes it live — traffic charts, device/country breakdowns, a live activity feed, and a synthetic event generator for load-testing.

**Live demo:** https://pulseiq-platform-nine.vercel.app

Built with Next.js, Drizzle ORM, and PostgreSQL.

---

## Screenshots

### Sign In
![Auth](assets/login.png)

### Dashboard
Key metrics (users, logins, purchases, searches, errors), login/request charts over 24h, event-type breakdown, device distribution.
![Dashboard](assets/dashboard.png)

### Events
Searchable, filterable event log — by user ID, event type, country, device, date range — with CSV export.
![Events](assets/events.png)

### Analytics
Deeper metrics: total events processed, unique users, uptime, success rate, error trends, top countries.
![Analytics](assets/analytics.png)

### Live Feed
Real-time stream of incoming events via Server-Sent Events (SSE).
![Live Feed](assets/live_feed.png)

### Event Generator
Simulate production traffic — generate 100 to 5,000 synthetic events (login, signup, purchase, search, logout, API error) with random users, countries, devices, and browsers.
![Generator](assets/generator.png)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** JWT (jsonwebtoken) + bcryptjs, cookie-based sessions
- **Real-time:** Server-Sent Events (SSE)
- **Charts:** Recharts
- **Styling:** Tailwind CSS 4
- **Validation:** Zod
- **Deployment:** Vercel

## Features

- Email/password auth (register, login, session via `/api/auth/me`)
- Live dashboard: total users, today's logins/purchases/searches/errors, success rate, avg response time
- Event log with multi-field filtering (user, type, country, device, date range) + CSV export
- Analytics view: login activity, request volume, error trends, device distribution, top countries
- Live activity feed streamed over SSE
- Traffic generator to simulate 1–5,000 synthetic events for testing

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # login, register, me
│   │   ├── dashboard/     # stats, timeline
│   │   ├── events/        # list, generate, export, recent
│   │   ├── stream/        # SSE endpoint
│   │   └── health/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/            # BarChartCard, LineChartCard, PieChartCard
│   ├── layouts/            # DashboardLayout
│   ├── pages/              # AuthPage, DashboardPage, EventsPage, AnalyticsPage, LiveFeedPage, GeneratorPage
│   ├── AppRouter.tsx
│   ├── AuthProvider.tsx
│   └── Navbar.tsx / Sidebar.tsx / StatCard.tsx / EventBadge.tsx
├── db/
│   ├── schema.ts           # users, events tables (Drizzle)
│   └── index.ts
├── hooks/
│   ├── useDashboardData.ts
│   └── useSSE.ts
└── lib/
    ├── auth.ts
    ├── constants.ts         # event types, countries, devices, browsers
    └── event-emitter.ts
```

## Data Model

**users** — id, email, password (hashed), name, role, createdAt

**events** — id, userId, eventType (`LOGIN` / `SIGNUP` / `PURCHASE` / `SEARCH` / `LOGOUT` / `API_ERROR`), country, device, browser, metadata (jsonb), timestamp, createdAt

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup

```bash
git clone <repo-url>
cd pulseiq-platform
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your-secret-key
```

Push the schema to your database:

```bash
npx drizzle-kit push
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check (no emit) |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Sign in |
| `/api/auth/me` | GET | Current session |
| `/api/dashboard/stats` | GET | Summary stats |
| `/api/dashboard/timeline` | GET | Time-series data for charts |
| `/api/events` | GET | Filtered event list |
| `/api/events/recent` | GET | Recent events (live feed) |
| `/api/events/generate` | POST | Generate synthetic events |
| `/api/events/export` | GET | Export events as CSV |
| `/api/stream` | GET | SSE stream |
| `/api/health` | GET | Health check |

## Deployment

Deployed on Vercel. Set `DATABASE_URL` and `JWT_SECRET` as environment variables in the Vercel project settings, then push to your connected branch.

## License

MIT (update as needed).
