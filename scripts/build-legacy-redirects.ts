import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from './lib/locales';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const site = 'https://helmax.1143402012.workers.dev';

/** Keep old Pages bookmarks usable without publishing a second copy of the website. */
export function buildLegacyRedirects(outDir = resolve(projectRoot, 'dist-redirects')) {
  rmSync(outDir, { recursive: true, force: true });
  for (const locale of ['', ...locales]) {
    const target = `${site}/${locale ? `${locale}/` : ''}`;
    const directory = resolve(outDir, locale);
    mkdirSync(directory, { recursive: true });
    writeFileSync(resolve(directory, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<meta name="robots" content="noindex, nofollow"><title>Helmax — website moved</title>
<link rel="canonical" href="${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
</head><body><p>Helmax 网站已迁移 / Website moved: <a href="${target}">${target}</a></p></body></html>\n`);
  }
  writeFileSync(resolve(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  writeFileSync(resolve(outDir, '.nojekyll'), '');
  return outDir;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Legacy Pages redirects ready in ${buildLegacyRedirects()}.`);
}
