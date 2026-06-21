# Basement Pickups

Boutique guitar pickup brand website. Custom React streaming SSR, vanilla CSS, design-system driven.

For project rules and AI workflow, read [`CLAUDE.MD`](./CLAUDE.MD) and the docs in [`docs/ai/`](./docs/ai/).

---

## Getting started

From the repo root:

```sh
# 1. Use the pinned Node version
nvm use                    # picks 24.16.0 from .nvmrc
# (first time only: nvm install 24.16.0)

# 2. Activate the pinned pnpm
corepack enable
corepack prepare pnpm@11.2.2 --activate

# 3. Install dependencies
pnpm install

# 4. Start the dev server (Vite + streaming SSR)
pnpm dev
```

Then open **http://localhost:3000**.

---

## Daily commands

| Command                             | What it does                                                  |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm dev`                          | Dev server on :3000 with HMR + SSR                            |
| `pnpm typecheck`                    | `tsc --noEmit` against strict config                          |
| `pnpm lint` / `pnpm lint:fix`       | ESLint over all `.ts` / `.tsx`                                |
| `pnpm stylelint`                    | Stylelint over `src/**/*.css`                                 |
| `pnpm format` / `pnpm format:check` | Prettier write / check                                        |
| `pnpm build`                        | Builds `dist/client` + `dist/server`                          |
| `pnpm start`                        | Runs the production server against the built bundles on :3000 |

---

## Notes

- If `nvm use` says the version isn't installed, run `nvm install 24.16.0` once.
- If `pnpm --version` shows 9.x instead of 11.2.2, your global pnpm is shadowing corepack's shim. Either rely on the corepack-managed binary in `~/.nvm/versions/node/v<version>/bin/pnpm` or uninstall the global one (`rm -rf ~/.local/share/pnpm/pnpm`).
- The server reads `process.env.PORT || 3000`, so `PORT=4000 pnpm dev` works if 3000 is taken.

---

## Tech stack

- **Runtime**: Node 24.16.0 LTS, pnpm 11.2.2
- **Framework**: React 19 + react-router 7 (library mode) with custom streaming SSR
- **Bundler**: Vite 8 + `@vitejs/plugin-react`
- **Server**: Express 5 (Vite middleware in dev, static + SSR in prod)
- **Language**: TypeScript 6 strictest
- **Styling**: vanilla CSS + CSS Modules for DS components, flat selectors, CSS variables (no Tailwind, no CSS-in-JS, no nesting)
- **Tooling**: ESLint 9 (flat config), Prettier 3, Stylelint 17

---

## Project layout

```
server/                Node SSR server + HTML template + SEO renderer
src/
  app/                 App shell, routes, browser router
  pages/               Route-level components (lazy-loaded, code-split)
  design-system/
    tokens/            Global CSS (reset, tokens, fonts, baseline)
    atoms/             DS atoms (each with its own .module.css)
    molecules/         DS molecules
    organisms/         DS organisms
    layouts/           DS layouts
  seo/                 Server-resolved SEO metadata
  data/                Local product / article / nav data
  utils/               Small shared helpers
  entry-client.tsx     Browser hydration entry
  entry-server.tsx     SSR render entry
public/assets/         Fonts, logo, images
docs/ai/               AI / project documentation (read in order)
design/references/     Approved visual references
```

---

## Deployment

The app is built to deploy to Heroku via Docker. The provided `Dockerfile` uses `node:24.16.0-alpine`, installs with `pnpm install --frozen-lockfile`, runs `pnpm run build`, and starts with `pnpm start`. The server listens on `process.env.PORT || 3000`.
