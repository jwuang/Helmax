import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { siteConfig } from '../src/config/site';
import { readDocuments, validateDocuments } from './validate-content';
const preview = process.argv.includes('--preview');
const errors = validateDocuments(readDocuments());
if (!preview) {
  const value = process.env.SITE_URL || '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password || /localhost|example\.|your-domain|\.test$/.test(url.hostname)) throw new Error();
  } catch { errors.push('Production requires SITE_URL to be your real HTTPS origin without path/query/credentials.'); }
  if (!siteConfig.publicationReviewed) errors.push('Review all brand, business copy and translations; set publicationReviewed in src/config/site.ts.');
  if (!siteConfig.privacyReviewed) errors.push('Complete and review the three privacy notices; set privacyReviewed.');
  if (!siteConfig.legalName || !siteConfig.email) errors.push('Configure legalName and a real contact email.');
}
if (siteConfig.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.email)) errors.push('Invalid contact email.');
if (siteConfig.phone && !/^\+?[0-9 ()-]{5,30}$/.test(siteConfig.phone)) errors.push('Invalid contact phone.');
if (siteConfig.wechatQr && (!siteConfig.wechatQr.startsWith('/images/') || siteConfig.wechatQr.includes('..') || !existsSync(resolve('public', siteConfig.wechatQr.slice(1))))) errors.push('WeChat QR must reference an existing /images/ asset.');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
const siteUrl = preview ? (process.env.PREVIEW_SITE_URL || 'https://preview.example.test') : process.env.SITE_URL!;
const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
  stdio: 'inherit', env: { ...process.env, SITE_URL: siteUrl, PUBLIC_SITE_MODE: preview ? 'preview' : 'production' },
});
if (result.status !== 0) process.exit(result.status || 1);
writeFileSync('dist/robots.txt', preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml\n`);
writeFileSync('dist/build-info.json', JSON.stringify({ mode: preview ? 'preview' : 'production', builtAt: new Date().toISOString() }, null, 2));
// Structural validation catches broken internal links/resources in the actual output.
const check = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/check-dist.ts'], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status || 1);
console.log(`Static ${preview ? 'PREVIEW (noindex)' : 'PRODUCTION'} build ready in dist/.`);
