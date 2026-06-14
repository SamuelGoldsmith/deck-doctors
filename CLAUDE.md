# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — run Next.js ESLint
- `node scripts/compress-images.mjs` — compresses all `.jpg`/`.jpeg` files under `public/` in place with sharp
- `node --env-file=.env.local scripts/geocode-jobs.mjs` — one-time backfill: geocodes any `jobs` rows missing `latitude`/`longitude` (e.g. jobs created before geocoding-on-save existed)

There is no test suite configured.

## Architecture

This is a Next.js 15 (App Router) site for "Deck Doctors", a deck restoration/construction business. It has two halves:

1. **Public marketing site** — `app/(main)/` (home, about, gallery, testimonials, estimate request, job application, contact). Uses `components/navbar.tsx` and `components/footer.tsx`.
2. **Internal employee portal** — `app/(employee)/employee-portal/` (CRUD admin for customers, jobs, employees, hours, applications). Gated by NextAuth session; uses `components/employee/navbar.tsx` and `components/employee/footer.tsx`. The layout (`app/(employee)/employee-portal/layout.tsx`) renders `children` only if `getSession()` returns a session, otherwise shows a sign-in prompt.

### Data layer

- **Database**: Neon serverless Postgres, accessed via `@neondatabase/serverless`'s `neon()` tagged-template client. Schema lives in `lib/tables.sql` (tables: `employees`, `customers`, `jobs`, `hours`, `expenses`, `job_applications`, plus a `users` table for auth).
- **Domain types**: All shared TypeScript interfaces (`Employee`, `Customer`, `Job`, `Hour`, `hoursWithEmployeeAndJob`, `Expense`) live in `lib/utils.ts`, alongside client-side mutation helpers (`addJobs`, `editEmployee`, `deleteCustomer`, etc.) that POST to the corresponding API route and `confirm()` before destructive deletes.
- **Server-side fetch helpers**: `lib/serverUtils.ts` contains `getSession()` plus server-component data fetchers (`getEmployees`, `getJobs`, `getCustomers`, `getHours`, `getJobById`, etc.). These work by re-fetching the app's own `/api/...` routes server-side, forwarding the incoming request's cookies (via `next/headers` `cookies()`) so the API route's session check succeeds. They depend on `NEXTAUTH_URL` being set correctly.

### API routes (`app/api/`)

Each resource (`jobs`, `customers`, `employees`, `expenses`, `hours`, `applications`) follows the same REST-ish convention as separate route files rather than one route with multiple HTTP verbs:
- `add/route.ts` — POST, bulk insert (accepts an array, builds a multi-row `INSERT ... VALUES (...), (...)` via `sql.query` with positional params)
- `edit/route.ts` — POST, update by id
- `delete/route.ts` — POST, delete by id
- `list/route.ts` — GET, list all
- `select/route.ts` (and nested variants like `hours/select/job`) — GET, fetch by id/filter via query params

Every route that touches non-public data calls `getServerSession(authOptions)` and returns `401` if there's no session — replicate this check in any new route. Each route file creates its own `neon(process.env.DATABASE_URL!)` client.

### Auth

NextAuth (`lib/authOptions.ts`) with Google OAuth only, JWT session strategy. On sign-in, the `signIn` callback upserts the user into the `users` table by email. `app/api/auth/[...nextauth]/route.ts` wires this up. Sign in/out UI is in `components/signin.tsx` / `components/signout.tsx`.

### UI components

- `components/ui/` — shadcn/ui primitives (new-york style, see `components.json`; aliases `@/components`, `@/lib`, `@/components/ui`, `@/hooks`). Add new shadcn components with the shadcn CLI to keep this consistent.
- `components/Forms.tsx` — shared form components (e.g. `QuickAddHours`) used across employee-portal pages.
- `components/table.tsx` / `components/ui/table.tsx` — generic table rendering used for entity list pages.
- Styling is Tailwind v4 (`@tailwindcss/postcss`, `tw-animate-css`); global styles in `styles/globals.css`.
- Path alias `@/*` maps to the repo root (see `tsconfig.json`).

### Environment

Required env vars (see `.env.local` / `.env.prod`, not committed): `DATABASE_URL` (Neon Postgres), `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`. Postmark and reCAPTCHA packages are dependencies and likely used for contact/apply forms — check for their API keys when working on those flows.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
