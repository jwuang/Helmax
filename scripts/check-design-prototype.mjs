import { chromium, firefox, webkit } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { extname, join, resolve, sep } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const built = process.argv.includes('--built');
const browserName = process.argv.find((argument) => argument.startsWith('--browser='))?.split('=')[1] || 'chromium';
const browserType = { chromium, firefox, webkit }[browserName];
if (!browserType) throw new Error(`Unsupported browser: ${browserName}`);
const out = join(projectRoot, 'reports/design-prototype', browserName === 'chromium' ? '' : browserName);
const locales = {
  'zh-cn': { lang: 'zh-CN', values: '利他/专业/效率/创新', loading: '正在准备' },
  'zh-hk': { lang: 'zh-HK', values: '利他/專業/效率/創新', loading: '正在準備' },
  en: { lang: 'en', values: 'Altruism/Expertise/Efficiency/Innovation', loading: 'Getting ready' },
};
let server;
let base;
if (built) {
  const root = resolve(projectRoot, 'dist-pages');
  // Exercise the real project Pages prefix, including directory index navigation.
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith('/corporate-portal/')) throw new Error('Outside Pages prefix');
      const file = resolve(root, pathname.slice('/corporate-portal/'.length), pathname.endsWith('/') ? 'index.html' : '');
      if (!file.startsWith(root + sep)) throw new Error('Outside output directory');
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': extname(file) === '.png' ? 'image/png' : 'text/html; charset=utf-8' });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  base = `http://127.0.0.1:${server.address().port}/corporate-portal/`;
}
const sourceFor = (locale) => built
  ? new URL(`${locale}/`, base).href
  : `${pathToFileURL(join(projectRoot, 'docs/design/helmax-exhibition-prototype.html')).href}?lang=${locale}`;
await mkdir(out, { recursive: true });
const results = { browser: browserName, target: built ? 'dist-pages' : 'homepage-source', viewports: [], accessibility: [], interactions: {}, loading: {}, errors: [], failures: [] };
const check = (condition, message) => { if (!condition) results.failures.push(message); };
const browser = await browserType.launch({
  headless: true,
  ...(browserName === 'chromium' && process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const ready = async (page) => page.waitForFunction(() => !document.documentElement.classList.contains('is-preparing'));
const audit = async (page, label) => {
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  results.accessibility.push({ label, violations: axe.violations.map((item) => ({
    id: item.id, impact: item.impact,
    nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
  })) });
};
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (error) => results.errors.push(error.message));
  for (const [locale, expected] of Object.entries(locales)) {
    for (const [width, height] of [[1440, 900], [1920, 1080], [1280, 720], [768, 1024], [390, 844], [320, 740]]) {
      await page.setViewportSize({ width, height });
      await page.goto(sourceFor(locale), { waitUntil: 'load' });
      await ready(page);
      await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
        await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
      });
      const layout = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        scrollWidth: document.documentElement.scrollWidth,
        sections: [...document.querySelectorAll('.chapter')].map((element) => {
          const box = element.getBoundingClientRect();
          const content = element.querySelector('.content').getBoundingClientRect();
          return { id: element.id, height: Math.round(box.height), contentInside: content.top >= box.top && content.bottom <= box.bottom };
        }),
        missingImages: [...document.images].filter((img) => !img.complete || !img.naturalWidth).map((img) => img.getAttribute('src')),
        values: [...document.querySelectorAll('.value h3')].map((element) => element.textContent).join('/'),
        loading: document.querySelector('.loader-label').textContent,
      }));
      results.viewports.push({ locale, width, height, ...layout });
      check(layout.lang === expected.lang, `${locale}: wrong document language`);
      check(layout.values === expected.values, `${locale}: culture values mismatch`);
      check(layout.loading === expected.loading, `${locale}: loading message mismatch`);
      check(layout.scrollWidth <= width, `${locale}: horizontal overflow at ${width}`);
      check(!layout.missingImages.length, `${locale}: missing images at ${width}`);
      for (const section of layout.sections) {
        check(section.contentInside, `${locale}: content outside ${section.id} at ${width}`);
        if (width > 800) check(section.height <= height + 1, `${locale}: ${section.id} chapter too tall at ${width}: ${section.height}`);
      }
      const headerFits = await page.locator('.header-inner').evaluate((header) => {
        const children = [...header.children].filter((element) => window.getComputedStyle(element).display !== 'none');
        return children.every((element, index) => !index || element.getBoundingClientRect().left >= children[index - 1].getBoundingClientRect().right);
      });
      check(headerFits, `${locale}: overlapping header at ${width}`);
      if (width === 1440 || width === 390) {
        const label = width === 1440 ? 'desktop' : 'mobile';
        await audit(page, `${locale}-${label}`);
        await page.screenshot({ path: `${out}/helmax-${locale}-hero-${label}.png` });
        await page.evaluate(() => document.querySelector('#culture').scrollIntoView({ behavior: 'instant', block: 'start' }));
        await page.screenshot({ path: `${out}/helmax-${locale}-culture-${label}.png` });
        if (width === 1440) {
          await page.evaluate(() => document.querySelector('#products').scrollIntoView({ behavior: 'instant', block: 'start' }));
          await page.screenshot({ path: `${out}/helmax-${locale}-products-desktop.png` });
          await page.screenshot({ path: `${out}/helmax-${locale}-home-desktop-full.png`, fullPage: true });
        }
      }
    }
    // Verify mobile controls, language URLs, selected state, history and retained chapter hash.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(sourceFor(locale));
    await ready(page);
    await page.keyboard.press('Tab');
    const interaction = {};
    interaction.skipLinkFocus = await page.locator('.skip').evaluate((element) => element === document.activeElement);
    await page.locator('.mobile-menu summary').click();
    interaction.mobileMenuOpen = await page.locator('.mobile-menu').evaluate((element) => element.open);
    await page.keyboard.press('Escape');
    interaction.escapeClosesMenu = await page.locator('.mobile-menu').evaluate((element) => !element.open);
    await page.locator('.mobile-menu summary').click();
    await page.locator('.mobile-menu nav a[href="#products"]').click();
    interaction.productLinkHash = new URL(page.url()).hash === '#products';
    interaction.menuClosesAfterNavigation = await page.locator('.mobile-menu').evaluate((element) => !element.open);
    await page.locator('.language-menu summary').click();
    interaction.currentLanguage = await page.locator('.language-options a[aria-current="page"]').getAttribute('data-locale') === locale;
    await audit(page, `${locale}-language-menu`);
    const next = locale === 'zh-cn' ? 'zh-hk' : locale === 'zh-hk' ? 'en' : 'zh-cn';
    await page.locator(`.language-options a[data-locale="${next}"]`).click();
    await ready(page);
    interaction.languageSwitch = await page.locator('html').getAttribute('lang') === locales[next].lang;
    interaction.retainedHash = new URL(page.url()).hash === '#products';
    await page.reload();
    await ready(page);
    interaction.reloadKeepsLanguage = await page.locator('html').getAttribute('lang') === locales[next].lang;
    await page.goBack();
    await ready(page);
    interaction.backRestoresLanguage = await page.locator('html').getAttribute('lang') === expected.lang;
    await page.locator('.language-menu summary').click();
    await page.keyboard.press('Escape');
    interaction.escapeClosesLanguage = await page.locator('.language-menu').evaluate((element) => !element.open && element.querySelector('summary') === document.activeElement);
    await page.locator('.language-menu summary').click();
    await page.locator('.brand').click();
    interaction.outsideClosesLanguage = await page.locator('.language-menu').evaluate((element) => !element.open);
    await page.locator('.mobile-menu summary').click();
    await page.locator('.language-menu summary').click();
    interaction.oneMenuOpen = await page.locator('.mobile-menu').evaluate((element) => !element.open);
    results.interactions[locale] = interaction;
    for (const [name, passed] of Object.entries(interaction)) check(passed, `${locale}: ${name}`);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const motion = await page.evaluate(() => ({
      animation: window.getComputedStyle(document.querySelector('.visual-orbit')).animationName,
      scroll: window.getComputedStyle(document.documentElement).scrollBehavior,
      snap: window.getComputedStyle(document.documentElement).scrollSnapType,
    }));
    check(motion.animation === 'none' && motion.scroll === 'auto' && motion.snap === 'none', `${locale}: reduced motion`);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
  if (built) {
    await page.goto(base);
    await ready(page);
    check(await page.locator('html').getAttribute('lang') === 'zh-CN', 'Root homepage must default to Simplified Chinese');
    await page.locator('.language-menu summary').click();
    await page.locator('.language-options a[data-locale="en"]').click();
    await ready(page);
    check(new URL(page.url()).pathname === '/corporate-portal/en/', 'Root language switch escapes Pages prefix');
  } else {
    await page.goto(sourceFor('invalid'));
    await ready(page);
    check(await page.locator('html').getAttribute('lang') === 'zh-CN', 'Invalid prototype language must fall back to Simplified Chinese');
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  for (const locale of built ? Object.keys(locales) : ['zh-cn']) {
    await staticPage.goto(sourceFor(locale));
    check(await staticPage.locator('main h1, main h2').count() === 6, `${locale}: no-JavaScript headings`);
    check(await staticPage.locator('h1').isVisible(), `${locale}: no-JavaScript content hidden`);
    check(!(await staticPage.locator('#page-loader').isVisible()), `${locale}: no-JavaScript loader visible`);
    check(await staticPage.locator('html').getAttribute('lang') === locales[locale].lang, `${locale}: no-JavaScript language`);
    if (built) {
      const next = locale === 'en' ? 'zh-cn' : 'en';
      await staticPage.locator('.language-menu summary').click();
      await staticPage.locator(`.language-options a[data-locale="${next}"]`).click();
      check(await staticPage.locator('html').getAttribute('lang') === locales[next].lang, `${locale}: no-JavaScript language navigation`);
    }
  }
  await noJs.close();

  for (const [locale, expected] of Object.entries(locales)) {
    const slow = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await slow.addInitScript(() => {
      Object.defineProperty(document.fonts, 'ready', { value: new Promise((done) => { window.__releaseFontsForReview = done; }) });
    });
    const loadingPage = await slow.newPage();
    loadingPage.on('pageerror', (error) => results.errors.push(error.message));
    await loadingPage.goto(sourceFor(locale), { waitUntil: 'load' });
    await loadingPage.waitForSelector('#page-loader', { state: 'visible' });
    const pending = await loadingPage.evaluate(() => ({
      inert: document.getElementById('page-content').inert,
      busy: document.getElementById('page-content').getAttribute('aria-busy'),
      label: document.querySelector('.loader-label').textContent,
    }));
    check(pending.inert && pending.busy === 'true' && pending.label === expected.loading, `${locale}: loading state or translation`);
    await loadingPage.screenshot({ path: `${out}/helmax-${locale}-loading-desktop.png` });
    await audit(loadingPage, `${locale}-loading`);
    await loadingPage.emulateMedia({ reducedMotion: 'reduce' });
    check(await loadingPage.locator('.loader-progress').evaluate((element) => window.getComputedStyle(element, '::before').animationName) === 'none', `${locale}: loader reduced motion`);
    await loadingPage.evaluate(() => window.__releaseFontsForReview());
    await loadingPage.waitForSelector('#page-loader', { state: 'hidden' });
    const afterReady = await loadingPage.evaluate(() => ({
      inert: document.getElementById('page-content').inert,
      busy: document.getElementById('page-content').getAttribute('aria-busy'),
      contentVisible: window.getComputedStyle(document.getElementById('page-content')).visibility,
    }));
    results.loading[locale] = { pending, afterReady };
    check(!afterReady.inert && afterReady.busy === 'false' && afterReady.contentVisible === 'visible', `${locale}: ready content blocked`);
    await slow.close();
  }
  const stalled = await browser.newContext();
  await stalled.addInitScript(() => { Object.defineProperty(document.fonts, 'ready', { value: new Promise(() => {}) }); });
  const stalledPage = await stalled.newPage();
  await stalledPage.goto(sourceFor('en'), { waitUntil: 'load' });
  await stalledPage.waitForSelector('#page-loader', { state: 'visible' });
  await ready(stalledPage);
  const timeout = await stalledPage.evaluate(() => ({
    elapsedMs: Math.round(window.performance.now()),
    inert: document.getElementById('page-content').inert,
    contentVisible: window.getComputedStyle(document.getElementById('page-content')).visibility,
  }));
  results.loading.timeout = timeout;
  check(!timeout.inert && timeout.elapsedMs <= 6000 && timeout.contentVisible === 'visible', 'Loading timeout failed');
  await stalled.close();
  const broken = await browser.newContext();
  await broken.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => { document.querySelector('.brand img').src = 'missing-logo-test.png'; }, { once: true });
  });
  const brokenPage = await broken.newPage();
  await brokenPage.goto(sourceFor('zh-hk'), { waitUntil: 'load' });
  await ready(brokenPage);
  check(await brokenPage.locator('h1').isVisible(), 'Broken logo blocks loading');
  await broken.close();
  await writeFile(join(out, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({
    pages: built ? 'Published Pages website' : 'Local homepage source',
    browser: browserName,
    viewportChecks: results.viewports.length,
    failures: results.failures,
    accessibility: results.accessibility,
    interactions: results.interactions,
    loading: results.loading,
    errors: results.errors,
  }, null, 2));
  if (results.failures.length || results.errors.length || results.accessibility.some((item) => item.violations.length)) process.exitCode = 1;
} finally {
  await browser.close();
  if (server) await new Promise((done) => server.close(done));
}
