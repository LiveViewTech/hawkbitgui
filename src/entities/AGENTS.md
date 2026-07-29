## Context

Domain models, status constants, type guards, and FIQL filter helpers shared by services and UI.

## Tech

- Plain TypeScript types/interfaces (no runtime ORM)
- Barrel export: `src/entities/index.ts`
- FIQL builder: `FilterFiql` in `src/entities/filter.ts`

## Architecture

Services map Hawkbit JSON into these shapes; UI stores and tables consume the same types. Status enums often ship with display color maps (e.g. `TargetStatusColors` in `src/entities/target.ts`).

## Patterns

- DO: add type guards next to the interface when validating unknown API data (`isTarget` in `src/entities/target.ts`).
- DO: build list filters with `FilterFiql` / `parseFiltersToFeedItemQueryLanguage` rather than hand-stringifying FIQL (`src/entities/filter.ts`).
- DON'T: put axios calls in entities — HTTP belongs in `src/services`.

## Key Files

- `src/entities/index.ts`
- `src/entities/target.ts`
- `src/entities/filter.ts`
- `src/entities/distribution.ts`
- `src/entities/rollout.ts`
