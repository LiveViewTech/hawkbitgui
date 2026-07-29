## Purpose

Standalone Next.js GUI for Eclipse Hawkbit. Operators manage targets, distribution sets, software modules, artifacts, and rollouts through Hawkbit's Management REST API without embedding Hawkbit server code.

## Project Snapshot

- Type: single Next.js app (not a monorepo)
- Stack: TypeScript, Next.js 16, React 19, next-auth, TanStack React Query, Zustand, Axios, Zod, Sass
- Node: `>=20.9.0` (see `package.json#engines`)
- Backend: Eclipse Hawkbit Management API via `NEXT_PUBLIC_HAWKBIT_API_URL`
- Subguides listed under Directory Map

## Commands

```bash
npm install
npm run dev          # next dev --turbopack
npm run build
npm run start
npm run lint         # eslint .
npm run format       # prettier --write .
npm run format:check
```

Docker (optional local stack with Hawkbit server):

```bash
docker compose up
```

Env (copy `.env.example` → `.env`):

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (must match the browser origin)
- `NEXT_PUBLIC_HAWKBIT_API_URL` (Hawkbit base URL, e.g. `http://localhost:8080`)

## Conventions

- Path alias: `@/*` → `src/*` (`tsconfig.json`)
- Authenticated UI lives under `/x/*`; login at `/login`
- Feature folders use `components/` (presentational) + `containers/` (state/wiring) + `hooks/`
- Browser Hawkbit calls go through `/api/hawkbit` only — never call `NEXT_PUBLIC_HAWKBIT_API_URL` from client code
- Server data: React Query hooks; table/UI state: Zustand stores
- No automated test script or CI workflow is present in this repo

## Directory Map

- `src/app/api/` → see `src/app/api/AGENTS.md`
- `src/app/components/` → see `src/app/components/AGENTS.md`
- `src/app/x/deployment/` → see `src/app/x/deployment/AGENTS.md`
- `src/app/x/distributions/` — distribution sets CRUD/tags/metadata
- `src/app/x/rollout/` — rollout lifecycle UI
- `src/app/x/upload/` — artifact upload/download
- `src/app/x/target-filters/` — saved target filters
- `src/app/x/configuration/` — system configuration form
- `src/app/x/software-modules/` — shared module UI (embedded; no `page.tsx`)
- `src/services/` → see `src/services/AGENTS.md`
- `src/entities/` → see `src/entities/AGENTS.md`
- `src/stores/` → see `src/stores/AGENTS.md`
- `src/lib/` — `auth-options.ts`, browser axios instance
- `src/middlewares/` — session redirect chain used by `src/middleware.ts`
- `src/config/env.ts` — env accessor for Hawkbit/next-auth URLs

## Gotchas

- **JWT carries Hawkbit Basic credentials** in claim `hawkbitAuth` (`src/lib/auth-options.ts`). Session object omits it; proxy reads it server-side (`src/app/api/hawkbit/[...path]/route.ts`).
- **CORS headers** in `next.config.ts` set `Access-Control-Allow-Origin: *` with credentials enabled — verify before exposing beyond trusted networks.
- **Upload body limit is 4gb** (`next.config.ts` `serverActions.bodySizeLimit` / `proxyClientMaxBodySize`).
- Dockerfile runs `bun`; repo commits `package-lock.json` and README documents npm — confirm which package manager your environment expects.
