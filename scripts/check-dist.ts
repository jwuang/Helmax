import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { load } from 'cheerio';
import { safeHref } from '../src/lib/security';
const root = resolve('dist'); const errors: string[] = [];
const html = readdirSync(root, { recursive: true }).filter((p) => typeof p === 'string' && p.endsWith('.html')) as string[];
for (const file of html) {
  const $ = load(readFileSync(resolve(root, file), 'utf8'));
  if ($('h1').length !== 1) errors.push(`${file}: expected one h1`);
  if (!$('html').attr('lang') || !$('title').text() || !$('meta[name="description"]').attr('content')) errors.push(`${file}: missing metadata`);
  $('a[href],img[src],script[src],link[href],source[srcset],img[srcset]').each((_, element) => {
    const node = $(element);
    const values = [node.attr('href'), node.attr('src'), ...(node.attr('srcset')?.split(',').map((x) => x.trim().split(/\s+/)[0]) || [])].filter(Boolean) as string[];
    for (const value of values) {
      if (node.is('a')) { try { safeHref(value); } catch { errors.push(`${file}: unsafe href ${value}`); } }
      if (/^(?:[a-z]+:|\/\/|#)/i.test(value)) continue;
      const clean = decodeURIComponent(value.split(/[?#]/)[0]!);
      if (!clean) continue;
      const target = clean.startsWith('/') ? resolve(root, `.${clean}`) : resolve(root, dirname(file), clean);
      if (!target.startsWith(root + '/') && target !== root) { errors.push(`${file}: path escapes dist`); continue; }
      if (!existsSync(target) && !existsSync(resolve(target, 'index.html'))) errors.push(`${file}: missing ${value}`);
    }
  });
}
if (errors.length) { console.error([...new Set(errors)].join('\n')); process.exit(1); }
console.log(`Checked ${html.length} pages: internal links, assets and metadata OK.`);
