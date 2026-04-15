# Recurrly

Recurrly is a cross-platform subscription tracking app that helps users organize recurring expenses, monitor renewal dates, and get reminder notifications before charges hit.

This repo contains:

- `frontend/`: Expo + React Native app (Expo Router) with Clerk auth and PostHog analytics.
- `backend/`: Node.js + Express REST API backed by MongoDB, with Clerk-protected routes and an Upstash Workflow-powered reminder system that sends emails via Nodemailer.

---

## Features

- Subscription management: name, price, currency, category, frequency, start/renewal dates, payment method, status
- Auth via Clerk (mobile and API)
- Upcoming renewals + insights-friendly data model
- Automated reminder workflow (7/5/2/1/0 days before renewal) + email notifications
- API documentation (human docs + OpenAPI spec)
- Note: the current mobile UI is wired to a local Zustand store seeded with sample data; the backend API is available in `backend/` for integration.

---

## Tech Stack

**Mobile**

- Expo, React Native, TypeScript
- Expo Router, React Navigation
- NativeWind (Tailwind-style styling)
- Clerk (auth)
- PostHog (analytics)
- Zustand (local state)

**Backend**

- Node.js, Express (ESM)
- MongoDB + Mongoose
- Clerk (API auth)
- Upstash Workflow / QStash (reminder workflow orchestration)
- Nodemailer (email)
- Arcjet (optional security/rate-limiting integration)

---

## Repo Structure

```
.
├── backend/                 # Express API + workflows
│   ├── app.js
│   ├── config/              # env, Upstash, Nodemailer, Arcjet
│   ├── controllers/
│   ├── database/
│   ├── docs/                # API.md + openapi.yaml
│   ├── models/
│   ├── routes/
│   └── scripts/
└── frontend/                # Expo app
    ├── app/                 # Expo Router routes
    ├── components/
    ├── lib/
    └── src/
```

---

## Getting Started (Local)

### Prerequisites

- Node.js (recommended: latest LTS)
- npm
- MongoDB connection string (local MongoDB or MongoDB Atlas)
- Clerk account (publishable key for the mobile app; secret key for the backend)

### 1) Backend setup

From the repo root:

```bash
cd backend
npm install
```

Create an env file matching `backend/config/env.js`:

- The backend loads `.env.${NODE_ENV}.local` (defaults to `.env.development.local`).

Create `backend/.env.development.local`:

```bash
PORT=5500
NODE_ENV=development
DB_URI=mongodb://localhost:27017
SERVER_URL=http://localhost:5500
CORS_ORIGINS=http://localhost:8081,http://localhost:19006,http://localhost:3000

# Clerk (required for protected routes)
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

# Recommended (JWT verification)
CLERK_JWT_KEY=

# Optional: lock down allowed parties (comma-separated)
CLERK_AUTHORIZED_PARTIES=

# Upstash Workflow / QStash (required if you want reminder workflows)
QSTASH_URL=
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=

# Email (required to actually send reminder emails)
EMAIL_PASSWORD=

# Optional: Arcjet
ARCJET_KEY=
ARCJET_ENV=
```

Run the API:

```bash
npm run dev
```

The API listens on `http://localhost:5500` and serves routes under `/api/v1`.

### 2) Frontend setup

From the repo root:

```bash
cd frontend
npm install
```

Create `frontend/.env` (based on `frontend/.env.example`):

```bash
cp .env.example .env
```

Set:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (required)
- `POSTHOG_PROJECT_TOKEN` + `POSTHOG_HOST` (optional; analytics is disabled if not configured)

Run the app:

```bash
npm start
```

---

## API Docs

- Human-readable docs: `backend/docs/API.md`
- OpenAPI spec: `backend/docs/openapi.yaml`

Auth is via a Clerk session token on protected routes:

```
Authorization: Bearer <clerk_session_token>
```

---

## Reminder Workflow (Upstash + Email)

When a subscription is created, the backend can trigger an Upstash Workflow run that schedules reminder emails leading up to the renewal date.

Quick test script (requires a valid Clerk session token):

```bash
cd backend
npm run reminder:test -- "<CLERK_SESSION_TOKEN>"
```

Notes:

- The script defaults `BASE_URL` to a deployed URL; to test locally use:
  - `BASE_URL=http://localhost:5500 npm run reminder:test -- "<TOKEN>"`
- Email sending is configured in `backend/config/nodemailer.js`. It currently uses a hardcoded Gmail address; update `accountMail` to your own sender and use an app password for `EMAIL_PASSWORD` if you’re using Gmail.

---

## Common Troubleshooting

- **Backend crashes with “Please define DB_URI…”**: create `backend/.env.development.local` and set `DB_URI`.
- **CORS issues from the app**: ensure the app’s origin is included in `CORS_ORIGINS` (comma-separated).
- **Clerk errors / 401**: confirm backend Clerk env vars are set, and that the route you’re calling is using a valid session token.
- **Analytics warning**: `POSTHOG_PROJECT_TOKEN` is optional; the app will disable PostHog if it’s missing.

---

## Scripts

**Backend**

- `npm run dev` — start API with nodemon
- `npm start` — start API with node
- `npm run reminder:test` — create a test subscription and validate reminders

**Frontend**

- `npm start` — run Expo dev server
- `npm run android` / `npm run ios` / `npm run web`
- `npm run lint`
