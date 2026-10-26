# Repository Guidelines

## Project Structure & Module Organization

This Astro static site supports `zh-cn`, `zh-hk`, and `en`, without a database or backend. Routes live in `src/pages/`; reusable UI and layouts in `src/components/` and `src/layouts/`. Shared logic and translations are in `src/lib/`, company settings in `src/config/site.ts`, and styles in `src/styles/`. Markdown collections live in `src/content/{services,cases,news}/`. Use `src/assets/` for processed images and `public/` for directly served assets. Validation scripts live in `scripts/`, tests in `tests/`, and architecture, content, and operations guidance in `docs/` and `OPS-TODO.md`.

## Build, Test, and Development Commands

Use Node `24.19.0` (24.x) and pnpm `11.25.0`. Install dependencies with `pnpm install --frozen-lockfile`.

- `pnpm dev`: Start development at `http://localhost:4321`.
- `pnpm check`: Check Astro/TypeScript and validate content relationships.
- `pnpm lint`: Run ESLint.
- `pnpm test`: Run content and link-safety unit tests.
- `pnpm build:preview && pnpm preview`: Build and serve the noindex sample site.
- `pnpm test:e2e`: Test the built site across Chromium, Firefox, and WebKit.
- `pnpm verify`: Run checks, lint, unit tests, preview build, and browser tests.
- `pnpm build`: Produce reviewed production output in `dist/`.

## Coding Style & Naming Conventions

Follow existing two-space indentation, single-quoted JavaScript/TypeScript strings, and semicolons. Use strict TypeScript, including `noUncheckedIndexedAccess`. Name Astro components in PascalCase, utilities in camelCase, and content files like `planning.zh-cn.md`. ESLint covers JavaScript, TypeScript, and Astro; match surrounding formatting.

## Testing Guidelines

Unit tests use `node:test` and strict assertions in `tests/unit/*.test.ts`; browser tests use Playwright and axe accessibility checks in `tests/e2e/*.spec.ts`. Install browsers with `pnpm exec playwright install --with-deps chromium firefox webkit`. Build with `pnpm build:preview` before standalone browser tests. For behavior changes, add focused regression coverage and run `pnpm verify`. No numeric coverage threshold is configured.

## Commit & Pull Request Guidelines

History favors imperative, descriptive subjects, sometimes with a `docs:` prefix; no mandatory Conventional Commits scheme is evident. Keep commits focused. PRs should describe changes, link relevant issues, report validation, and include screenshots for visual changes across affected locales and viewport sizes.

## Content & Configuration

Translations share a stable `translationKey`; `routeSlug` uses lowercase kebab-case. Keep unreviewed content as drafts and use Markdown without raw HTML. Follow `docs/CONTENT.md`. Production requires an actual HTTPS `SITE_URL` and completed publication/privacy review flags. Use `pnpm build` to enforce those checks. Keep secrets out of browser code and `PUBLIC_*` variables; CI validates previews without deploying.
