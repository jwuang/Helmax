import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const [locale, language] of [['zh-cn', 'zh-CN'], ['zh-hk', 'zh-HK'], ['en', 'en']]) {
  test(`${locale}: page, detail, translation and metadata`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', language!);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/$/);
    await page.locator('.content-card').first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/services/discovery/`));
    await page.locator('[data-language-menu] summary').click();
    await page.locator('.language-options a[lang="en"]').click();
    await expect(page).toHaveURL(/\/en\/services\/discovery\/$/);
    await expect(page.locator('.prose')).toContainText('Service overview');
  });
}
test('draft sections hidden and contact never contains invented details', async ({ page }) => {
  await page.goto('/zh-cn/');
  await expect(page.locator('.desktop-nav a[href$="/cases/"]')).toHaveCount(0);
  await expect(page.locator('.desktop-nav a[href$="/news/"]')).toHaveCount(0);
  await page.goto('/zh-cn/contact/');
  await expect(page.locator('main')).toContainText('联系方式将在企业信息确认后公布');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  const sitemap = await page.request.get('/sitemap.xml');
  expect(await sitemap.text()).not.toContain('template');
});
test('mobile menu, escape dismissal and keyboard skip link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.locator('[data-mobile-menu] summary').click();
  await expect(page.locator('.mobile-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-mobile-menu]')).not.toHaveAttribute('open');
  await page.locator('[data-mobile-menu] summary').click();
  await page.locator('.mobile-panel a[href="/en/contact/"]').click();
  await expect(page).toHaveURL(/\/en\/contact\/$/);
});
test('no horizontal overflow across phone, tablet and desktop', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/en/', '/zh-hk/', '/en/contact/', '/en/services/discovery/']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} at ${width}px`).toBe(true);
    }
  }
});
test('home and contact pass automated accessibility checks', async ({ page }) => {
  for (const route of ['/zh-cn/', '/en/contact/']) {
    await page.goto(route);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  }
});
test('core content and navigation work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/en/');
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('[data-mobile-menu] summary').click();
  await page.locator('.mobile-panel a[href="/en/about/"]').click();
  await expect(page.locator('h1')).toHaveText('Understanding comes first.');
  await context.close();
});
test('unknown pages use the 404 document', async ({ page }) => {
  const response = await page.goto('/not-a-real-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
});
