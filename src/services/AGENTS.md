## Context

Typed static service classes that call the `/api/hawkbit` BFF for Hawkbit Management resources.

## Tech

- Axios instance from `src/lib/axios.ts`
- Domain types from `src/entities`
- Per-service `*.types.ts` for request/response shapes
- Shared `Representation` constants in `src/services/shared.ts`

## Architecture

UI hooks → `SomeService.staticMethod()` → `axiosInstance` → `/api/hawkbit/...` → Hawkbit REST. Services parse FIQL via `FilterFiql` (`src/entities/filter.ts`) into `q` query params where list endpoints support filtering.

## Patterns

- DO: keep HTTP in static class methods (e.g. `TargetsService.fetchTargets` in `src/services/targets-service.ts`).
- DO: put input/output types in sibling `*-service.types.ts` (e.g. `src/services/targets-service.types.ts`).
- DO: compute artifact checksums before upload in `SoftwareModuleArtifactsService` (`src/services/software-module-artifacts-service.ts`).
- DON'T: import feature-page React hooks into services; services stay framework-UI agnostic.
- DON'T: call `environment.hawkbitApiUrl` from services — that URL is server/proxy-only (`src/config/env.ts`).

## Key Files

- `src/services/targets-service.ts`
- `src/services/distribution-sets-service.ts`
- `src/services/rollouts-service.ts`
- `src/services/software-module-artifacts-service.ts`
- `src/services/system-configuration-service.ts`
