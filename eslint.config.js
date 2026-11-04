import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
export default defineConfig(
  { ignores: ['dist-pages/**', 'dist/**', '.astro/**', '.cloudflare/**', '.wrangler/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'reports/**', 'artifacts/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.{js,mjs,ts}'], languageOptions: { globals: { process: 'readonly', console: 'readonly', URL: 'readonly', Buffer: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', fetch: 'readonly', AbortSignal: 'readonly', document: 'readonly', window: 'readonly', HTMLElement: 'readonly', HTMLDetailsElement: 'readonly' } } },
);
