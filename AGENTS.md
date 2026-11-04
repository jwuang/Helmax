# Repository Guidelines

## Project Structure & Module Organization

This repository maintains only the Helmax exhibition-style static website in `zh-cn`, `zh-hk`, and `en`, without a database or backend. The shared homepage template, styles, interaction code, and `home-translations` dictionary live in `docs/design/helmax-exhibition-prototype.html`; keep this historical filename. Display assets live in `docs/design/assets/`. `scripts/build-pages.ts` generates the sole website output in `dist-pages/`, using language definitions from `scripts/lib/locales.ts`. Validation scripts live in `scripts/`, unit tests in `tests/unit/`, and architecture, content, and operations guidance in `docs/` and `OPS-TODO.md`.

## Build, Test, and Development Commands

Use Node `26.13.0` (26.x LTS) and pnpm `12.16.1`. Install dependencies with `pnpm install --frozen-lockfile`.

- `pnpm dev`: Build, watch the homepage HTML and assets, and serve at `http://localhost:4321`; refresh after edits.
- `pnpm check`: Run TypeScript checks with `tsc --noEmit`.
- `pnpm lint`: Run ESLint.
- `pnpm test`: Run website build unit tests.
- `pnpm build` / `pnpm build:pages`: Build the same three-language website into `dist-pages/`.
- `pnpm preview`: Serve the existing `dist-pages/` output.
- `pnpm test:pages` / `pnpm test:e2e`: Run the same website browser checks, using Chromium by default; select Firefox or WebKit with `--browser=firefox` or `--browser=webkit`.
- `pnpm verify`: Run type checks, lint, unit tests, website build, and Chromium browser checks.
- `pnpm audit:security`: Audit dependencies for high and critical vulnerabilities.

## Coding Style & Naming Conventions

Follow existing two-space indentation, single-quoted JavaScript/TypeScript strings, and semicolons. Use strict TypeScript, including `noUncheckedIndexedAccess`. Name utilities in camelCase and keep language keys and chapter anchors stable. ESLint covers JavaScript and TypeScript; match surrounding formatting.

## Testing Guidelines

Unit tests use `node:test` and strict assertions in `tests/unit/*.test.ts`. Website browser checks use Playwright and axe in `scripts/check-design-prototype.mjs`. Install browsers with `pnpm exec playwright install --with-deps chromium firefox webkit`. Run `pnpm build` before standalone browser tests. For behavior changes, add focused regression coverage and run `pnpm verify`, plus relevant Firefox and WebKit checks. CI validates the website in all three browsers. No numeric coverage threshold is configured. Reports and screenshots go to the ignored `reports/design-prototype/` directory.

## Commit & Pull Request Guidelines

History favors imperative, descriptive subjects, sometimes with a `docs:` prefix; no mandatory Conventional Commits scheme is evident. Keep commits focused. PRs should describe changes, link relevant issues, report validation, and include screenshots for visual changes across affected locales and viewport sizes.

## Content & Configuration

Maintain all three languages in the homepage `home-translations` dictionary, including metadata, image alternatives, and accessible labels. The build rejects missing or blank translation bindings. Add new display assets to the build's explicit copy list. Follow `docs/CONTENT.md`; keep unverified details clearly marked as pending and never invent product claims, contacts, or authorizations. Keep secrets out of browser code and published files. Preserve the current noindex and robots restrictions unless the user explicitly requests a change. Pull requests run checks; the Pages workflow deploys relevant main-branch changes.

## Helmax Website Continuation

Before continuing homepage or design work, read `docs/PROJECT-STATUS.md` for confirmed requirements, current artifacts, and next steps. `docs/CHAT-LOG.md` records the project conversation and design decisions. The user confirmed the exhibition design as the official website and requested removal of the earlier sample. Maintain this website as the sole implementation and preserve confirmed requirements rather than restarting the requirements interview. Historical chat and test records may mention removed components; use current documentation for active commands. The repository includes the local `ui-ux-pro-max` skill and its upstream license.
