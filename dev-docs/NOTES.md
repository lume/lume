# Lume Implementation Notes

Central index of developer-facing documentation in `dev-docs/`. Read this first when
starting any coding session — it links to all relevant design docs, migration plans,
and conventions.

---

## Index

### Migration Tracking

| File                                                                                         | Description                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`1_behavior-elements-migration-status.md`](1_behavior-elements-migration-status.md)         | Tracks progress migrating from old `has=` / `initialBehaviors` pattern to child behavior elements. Covers ported elements, remaining work, mesh migration status, and framework types. |
| [`2_behavior-element-type-declarations.md`](2_behavior-element-type-declarations.md)         | Reference for adding framework types (Solid.js JSX, DOM, React JSX) to custom elements. Includes patterns, templates, and notes for future framework support (Svelte, Vue, etc.).      |
| [`5_simplify-renderer-singletons.md`](5_simplify-renderer-singletons.md)                   | Plan to replace `WebglRendererThree` / `Css3dRendererThree` singletons with per-Scene instances.                                                                                     |

---

## Adding New Docs

When adding a new document to `dev-docs/`, **prefix the filename with a sequential
number** (e.g. `3_`, `4_`, …) incremented above the last existing doc. This
encodes the order docs were created in and roughly the order of work completed —
an agent reading this file can infer that the next doc should start at `<N+1>_`.

Add the new entry to the index above, keeping entries grouped by category with a
brief description so agents (and humans) can quickly find what's relevant.

## Conventions

- `dev-docs/` = developer-facing implementation notes, migration plans, architecture docs
- `apps/docs/` = user-facing documentation (Docsify site)
- These are **not** the same thing — do not mix them up
