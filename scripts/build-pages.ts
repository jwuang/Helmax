import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { htmlLanguages, locales, type Locale } from './lib/locales';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const designRoot = resolve(projectRoot, 'docs/design');

function renderHome(html: string, locale: Locale, prefix: string) {
  const $ = load(html);
  const translations = JSON.parse($('#home-translations').text()) as Record<Locale, Record<string, string>>;
  $('html').attr('lang', htmlLanguages[locale]);
  for (const attribute of [null, 'aria-label', 'alt', 'data-title', 'content']) {
    const binding = attribute ? `data-i18n-${attribute}` : 'data-i18n';
    $(`[${binding}]`).each((_, element) => {
      const key = $(element).attr(binding)!;
      const text = translations[locale]?.[key];
      if (typeof text !== 'string' || !text.trim()) throw new Error(`Missing homepage translation: ${locale}.${key}`);
      if (attribute) $(element).attr(attribute, text);
      else $(element).text(text);
    });
  }
  // The standalone prototype translates in the browser; deployed pages need no translation script.
  $('#home-translations, #prototype-i18n').remove();
  $('[data-locale]').each((_, element) => {
    const target = $(element).attr('data-locale');
    $(element).attr('href', `${prefix}${target}/`);
    if (element.tagName === 'a') {
      if (target === locale) $(element).attr('aria-current', 'page');
      else $(element).removeAttr('aria-current');
    }
  });
  $('img[src]').each((_, element) => {
    $(element).attr('src', `${prefix}${$(element).attr('src')}`);
  });
  return $.html();
}

/** Publish only the Helmax website and its display assets, never the rest of docs/. */
export function buildPages(outDir = resolve(projectRoot, 'dist-pages')) {
  const html = readFileSync(resolve(designRoot, 'helmax-exhibition-prototype.html'), 'utf8');
  const home = renderHome(html, 'zh-cn', '');
  const pages = locales.map((locale) => ({ locale, html: renderHome(html, locale, '../') }));
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(resolve(outDir, 'assets'), { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), home);
  for (const page of pages) {
    mkdirSync(resolve(outDir, page.locale), { recursive: true });
    writeFileSync(resolve(outDir, page.locale, 'index.html'), page.html);
  }
  for (const asset of ['helmax-logo.png', 'welding-machine.png', 'water-pump.png']) {
    cpSync(resolve(designRoot, 'assets', asset), resolve(outDir, 'assets', asset));
  }
  writeFileSync(resolve(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  return outDir;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Helmax website (noindex) ready in ${buildPages()}.`);
}
