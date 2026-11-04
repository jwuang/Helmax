import { defineConfig } from 'cf/config';

export default defineConfig({
  worker: {
    name: 'helmax',
    compatibilityDate: '2026-11-04',
    assets: {
      htmlHandling: 'auto-trailing-slash',
      notFoundHandling: 'none',
    },
    observability: {
      enabled: true,
      traces: { enabled: true },
    }
  }
});
