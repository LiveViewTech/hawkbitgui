## Context

Zustand stores for client UI state: pagination, filters, selection, tags, and page-local flags.

## Tech

- Zustand `create` stores under `src/stores/*`
- Consumed by feature hooks/containers (not by `src/services`)

## Architecture

React Query owns server cache; these stores own ephemeral UI. Example: `useGetPaginatedTargets` reads `page`/`size` from `useTargetsTableStore` (`src/app/x/deployment/hooks/use-get-paginated-targets.ts`, `src/stores/targets-table-store.ts`).

## Patterns

- DO: keep stores focused (one table/page concern per file), e.g. `src/stores/targets-table-store.ts` vs `src/stores/targets-filters-store.ts`.
- DO: reset store slices from containers when leaving a view if stale selection would leak (see `resetTargets` pattern in `src/stores/targets-store.ts`).
- DON'T: fetch Hawkbit data inside Zustand stores — use React Query hooks in feature `hooks/`.

## Key Files

- `src/stores/targets-table-store.ts`
- `src/stores/targets-store.ts`
- `src/stores/targets-filters-store.ts`
- `src/stores/rollouts-table-store.ts`
- `src/stores/software-modules-store.ts`
