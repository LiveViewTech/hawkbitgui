## Context

Primary deployment workspace: manage targets, inspect actions, and assign distribution sets (including drag-and-drop layout).

## Tech

- `@dnd-kit/core` for the deployment DnD surface
- React Query hooks in `hooks/`
- Zustand: `targets-table-store`, filters/tags/status stores
- Services: `TargetsService`, distribution/tag helpers from `src/services`

## Architecture

`page.tsx` → `DeploymentDndLayoutContainer` composes target/distribution cards and action history. Containers wire modals and stores; components render. Target lists use `useGetPaginatedTargets` → `TargetsService.fetchTargets`. Home (`src/app/page.tsx`) redirects to this route.

## Patterns

- DO: add new deployment UI as `components/<name>/` + `containers/<name>-container/` (see `targets-card-container/index.tsx`).
- DO: keep DnD orchestration in `deployment-dnd-layout-container`.
- DO: reuse shared target filter UI from `src/app/components/target-filters` when filtering cohorts.
- DON'T: bypass services with raw axios from components.
- DON'T: put pagination state only in React local state when a Zustand table store already exists for that grid.

## Key Files

- `src/app/x/deployment/page.tsx`
- `src/app/x/deployment/containers/deployment-dnd-layout-container/index.tsx`
- `src/app/x/deployment/containers/targets-card-container/index.tsx`
- `src/app/x/deployment/hooks/use-get-paginated-targets.ts`
- `src/app/x/deployment/containers/action-history-table-container/index.tsx`
