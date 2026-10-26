import type { APIRoute } from 'astro';
import { locales, pathFor } from '../lib/i18n';
import { entries, entryPath } from '../lib/content';
import { sections } from '../lib/content-model';
export const GET: APIRoute = async ({ site }) => {
  const paths: string[] = [];
  for (const locale of locales) {
    for (const page of ['', 'about', 'contact', 'privacy']) paths.push(pathFor(locale, page));
    for (const section of sections) {
      const items = await entries(section, locale);
      if (items.length) { paths.push(pathFor(locale, section)); paths.push(...items.map(entryPath)); }
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${new URL(path, site).href.replace(/&/g, '&amp;')}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
