## Context

Next.js route handlers for authentication and the Hawkbit Management API BFF proxy.

## Tech

- next-auth Credentials provider (`src/lib/auth-options.ts`)
- JWT session strategy (1h maxAge)
- Axios server-side calls to `${NEXT_PUBLIC_HAWKBIT_API_URL}/rest/v1/*`

## Architecture

1. `GET/POST /api/auth/[...nextauth]` — next-auth handler; login validates against Hawkbit `/rest/v1/userinfo` with Basic auth and stores base64 credentials in JWT `hawkbitAuth`.
2. `/api/hawkbit/[...path]` — catch-all proxy for GET/POST/PUT/DELETE. Reads JWT via `getToken`, requires `hawkbitAuth`, forwards to Hawkbit, preserves binary responses when Accept expects octet-stream/image.
3. Browser client (`src/lib/axios.ts`) uses `baseURL: '/api/hawkbit'` with cookies; 401 triggers `signOut`.

## Patterns

- DO: add new Hawkbit resource access in `src/services/*` against `/api/hawkbit` paths (see `TargetsService` in `src/services/targets-service.ts`).
- DON'T: expose `hawkbitAuth` on the client session (`src/lib/auth-options.ts` session callback only sets `tenant`/`username`).
- DO: return Hawkbit error payloads with original status from the proxy (`handleApiError` in `src/app/api/hawkbit/[...path]/route.ts`).
- DO: support multipart uploads by passing through `FormData` when `content-type` includes `multipart/form-data`.

## Key Files

- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/hawkbit/[...path]/route.ts`
- `src/lib/auth-options.ts`
- `src/lib/axios.ts`
- `src/middlewares/with-session-redirects-middleware.ts`
