# Preact Vite Example

This is a Preact project created with `npx init preact`, choosing the
`JavaScript` option and no other options, and then removing Preact's Vite preset
to replace it with a custom configuration of esbuild to show what a manual
configuration could look like. Basically this is the same as if we started with
a plain Vite setup and then added the minimal config needed to handle _only_
Preact JSX.

## Running

- `npm run dev` - Starts a dev server at http://localhost:5173/

- `npm run build` - Builds for production, emitting to `dist/`

- `npm run preview` - Starts a server at http://localhost:4173/ to test production build locally
