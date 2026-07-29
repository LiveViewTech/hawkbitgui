## Context

Shared UI primitives and chrome used across `/x/*` feature pages (tables, forms, modals, layout shell).

## Tech

- React client components + Sass modules
- App chrome: `src/app/components/layout`
- Table building blocks under `src/app/components/table`
- Forms via shared inputs plus react-hook-form in feature forms

## Architecture

`src/app/x/layout.tsx` wraps pages in `Layout` (`src/app/components/layout/index.tsx`), which owns sidebar nav to deployment, rollout, target-filters, distributions, upload, and configuration. Feature pages compose shared pieces (e.g. `PageWrapper`, `Modal`, `MetadataTable`) rather than reimplementing chrome.

## Patterns

- DO: put cross-feature widgets here; keep feature-only UI under `src/app/x/<feature>/components`.
- DO: follow existing component folder shape: `component-name/index.tsx` + `styles.module.scss`.
- DON'T: call Hawkbit services directly from shared primitives — pass data/callbacks from feature containers (`src/app/x/deployment/containers/targets-card-container/index.tsx`).

## Key Files

- `src/app/components/layout/index.tsx`
- `src/app/components/page-wrapper/index.tsx`
- `src/app/components/table`
- `src/app/components/modal`
- `src/app/components/metadata-table`
