import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
export default defineConfig(
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'reports/**', 'artifacts/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  { files: ['**/*.{js,mjs,ts,astro}'], languageOptions: { globals: { process: 'readonly', console: 'readonly', URL: 'readonly', Buffer: 'readonly', setTimeout: 'readonly', fetch: 'readonly', AbortSignal: 'readonly', document: 'readonly', window: 'readonly', HTMLElement: 'readonly', HTMLDetailsElement: 'readonly' } } },
);
