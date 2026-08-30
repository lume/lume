# Lume Agent Instructions

## Plan Documents

**⚠️ Read `dev-docs/NOTES.md` first in every coding session.** It is the mandatory entry
point that links to all developer-facing documentation — migration plans, architecture
decisions, conventions, and type declaration patterns.

This project uses `dev-docs/` for implementation plans and migration status tracking.
These are living documents for devs and agents to understand what's being worked on
and how things are implemented. They are NOT user-facing docs (those are in `apps/docs/`).

- **Always keep plan documents up to date after each iteration.** Mark items done immediately,
  update status summaries, and keep item numbering consistent.

## Behavior Elements Migration

The active migration plan is at `dev-docs/1_behavior-elements-migration-status.md`.
It tracks migrating from the old `has=` / `initialBehaviors` pattern to new
behavior-element custom elements as child elements.
