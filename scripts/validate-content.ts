import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import { locales, type Locale } from '../src/lib/i18n';
import { sections, type Section } from '../src/lib/content-model';
import { safeHref } from '../src/lib/security';
export interface Document { file: string; section: Section; data: Record<string, unknown>; body: string; }
export function readDocuments(root = process.cwd()): Document[] {
  return sections.flatMap((section) => {
    const directory = resolve(root, 'src/content', section);
    if (!existsSync(directory)) return [];
    return readdirSync(directory, { recursive: true }).filter((file) => typeof file === 'string' && file.endsWith('.md')).map((file) => {
      const full = resolve(directory, file as string);
      const { data, content } = matter(readFileSync(full, 'utf8'));
      return { file: relative(root, full), section, data, body: content };
    });
  });
}
export function validateDocuments(documents: Document[], root = process.cwd()): string[] {
  const errors: string[] = [];
  const routes = new Set<string>(); const translations = new Set<string>();
  for (const { file, section, data, body } of documents) {
    const fail = (message: string) => errors.push(`${file}: ${message}`);
    for (const key of ['translationKey', 'routeSlug']) if (typeof data[key] !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data[key] as string)) fail(`invalid ${key}`);
    for (const key of ['title', 'summary', 'category']) if (typeof data[key] !== 'string' || !(data[key] as string).trim()) fail(`missing ${key}`);
    if (!locales.includes(data.locale as Locale)) fail('invalid locale');
    if (!Number.isFinite(new Date(String(data.publishedAt)).getTime())) fail('invalid publishedAt');
    const route = `${section}/${data.locale}/${data.routeSlug}`;
    if (routes.has(route)) fail(`duplicate URL: ${route}`); routes.add(route);
    const translation = `${section}/${data.translationKey}/${data.locale}`;
    if (translations.has(translation)) fail(`duplicate translation: ${translation}`); translations.add(translation);
    if (data.locale !== 'zh-cn' && !documents.some((d) => d.section === section && d.data.translationKey === data.translationKey && d.data.locale === 'zh-cn')) fail('translation must have a zh-cn source with the same translationKey');
    if (data.cover && !data.coverAlt) fail('cover requires coverAlt');
    if (data.cover) {
      const asset = String(data.cover);
      if (!asset.startsWith('/images/') || asset.includes('..') || !existsSync(resolve(root, 'public', asset.slice(1)))) fail(`missing or invalid cover: ${asset}`);
    }
    if (/<\/?[A-Za-z][^>]*>/.test(body)) fail('raw HTML is disabled; use Markdown');
    for (const match of body.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      const href = match[1]!;
      try { safeHref(href); } catch { fail(`unsafe or non-absolute link: ${href}`); }
      if (href.startsWith('/images/') && !existsSync(resolve(root, 'public', href.slice(1)))) fail(`missing image: ${href}`);
    }
  }
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const documents = readDocuments(); const errors = validateDocuments(documents);
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log(`Validated ${documents.length} content documents.`);
}
