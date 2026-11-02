import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const source = pathToFileURL(join(projectRoot, process.argv.includes('--built') ? 'dist-pages/index.html' : 'docs/design/helmax-exhibition-prototype.html')).href;
const out = join(projectRoot, 'reports/design-prototype');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const results = { viewports: [], accessibility: [], interactions: {}, loading: {}, errors: [] };
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (error) => results.errors.push(error.message));
  for (const [width,height] of [[1440,900],[1920,1080],[1280,720],[768,1024],[390,844],[320,740]]) {
    await page.setViewportSize({ width, height });
    await page.goto(source, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => !document.documentElement.classList.contains('is-preparing'));
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
      await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    });
    const layout = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      sections: [...document.querySelectorAll('.chapter')].map((el) => {
        const b=el.getBoundingClientRect();
        const c=el.querySelector('.content').getBoundingClientRect();
        const style=window.getComputedStyle(el);
        return { id:el.id, height:Math.round(b.height), contentHeight:Math.round(c.height), paddingTop:style.paddingTop, paddingBottom:style.paddingBottom, contentInside:c.top >= b.top && c.bottom <= b.bottom, minHeight:style.minHeight };
      }),
      missingImages: [...document.images].filter((el) => !el.complete || !el.naturalWidth).map((el) => el.getAttribute('src')),
      values: [...document.querySelectorAll('.value h3')].map((el) => el.textContent),
    }));
    results.viewports.push({ width,height,...layout });
    if (width===1440 || width===390) {
      const label=width===1440 ? 'desktop' : 'mobile';
      const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      results.accessibility.push({label,violations:axe.violations.map((item)=>({id:item.id,impact:item.impact,nodes:item.nodes.map((node)=>({target:node.target,summary:node.failureSummary}))}))});
      await page.screenshot({path:`${out}/helmax-hero-${label}.png`});
      await page.locator('#culture').scrollIntoViewIfNeeded();
      await page.evaluate(() => document.querySelector('#culture').scrollIntoView({behavior:'instant',block:'start'}));
      await page.screenshot({path:`${out}/helmax-culture-${label}.png`});
      if (width===1440) {
        await page.evaluate(() => document.querySelector('#products').scrollIntoView({behavior:'instant',block:'start'}));
        await page.screenshot({path:`${out}/helmax-products-desktop.png`});
        await page.screenshot({path:`${out}/helmax-home-desktop-full.png`,fullPage:true});
      }
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(source);
  await page.waitForFunction(() => !document.documentElement.classList.contains('is-preparing'));
  await page.keyboard.press('Tab');
  results.interactions.skipLinkFocus = await page.locator('.skip').evaluate((el)=>el===document.activeElement);
  await page.locator('.mobile-menu summary').click();
  results.interactions.mobileMenuOpen = await page.locator('.mobile-menu').evaluate((el)=>el.open);
  await page.keyboard.press('Escape');
  results.interactions.escapeClosesMenu = await page.locator('.mobile-menu').evaluate((el)=>!el.open);
  await page.locator('.mobile-menu summary').click();
  await page.locator('.mobile-menu nav a[href="#products"]').click();
  results.interactions.productLinkHash = await page.evaluate(()=>window.location.hash);
  results.interactions.menuClosesAfterNavigation = await page.locator('.mobile-menu').evaluate((el)=>!el.open);
  await page.emulateMedia({reducedMotion:'reduce'});
  results.interactions.reducedMotion = await page.evaluate(()=>({animation:window.getComputedStyle(document.querySelector('.visual-orbit')).animationName,scroll:window.getComputedStyle(document.documentElement).scrollBehavior,snap:window.getComputedStyle(document.documentElement).scrollSnapType}));
  const noJs = await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});
  const staticPage=await noJs.newPage();
  await staticPage.goto(source);
  results.interactions.noJsVisibleHeadings = await staticPage.locator('main h1, main h2').count();
  results.loading.noJsContentVisible = await staticPage.locator('h1').isVisible();
  results.loading.noJsLoaderHidden = !(await staticPage.locator('#page-loader').isVisible());
  await noJs.close();

  const slow = await browser.newContext();
  await slow.addInitScript(() => {
    Object.defineProperty(document.fonts, 'ready', { value: new Promise((resolve) => { window.__releaseFontsForReview = resolve; }) });
  });
  const loadingPage = await slow.newPage();
  loadingPage.on('pageerror', (error) => results.errors.push(error.message));
  await loadingPage.setViewportSize({width:1440,height:900});
  await loadingPage.goto(source, {waitUntil:'load'});
  await loadingPage.waitForSelector('#page-loader', {state:'visible'});
  results.loading.pending = await loadingPage.evaluate(() => ({
    inert: document.getElementById('page-content').inert,
    busy: document.getElementById('page-content').getAttribute('aria-busy'),
    status: document.getElementById('page-loader').getAttribute('role'),
    label: document.querySelector('.loader-label').textContent,
  }));
  await loadingPage.screenshot({path:`${out}/helmax-loading-desktop.png`});
  const loadingAxe = await new AxeBuilder({page:loadingPage}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  results.accessibility.push({label:'loading',violations:loadingAxe.violations.map((item)=>({id:item.id,impact:item.impact,nodes:item.nodes.map((node)=>({target:node.target,summary:node.failureSummary}))}))});
  await loadingPage.setViewportSize({width:390,height:844});
  await loadingPage.screenshot({path:`${out}/helmax-loading-mobile.png`});
  await loadingPage.emulateMedia({reducedMotion:'reduce'});
  results.loading.reducedMotionAnimation = await loadingPage.locator('.loader-progress').evaluate((el)=>window.getComputedStyle(el,'::before').animationName);
  await loadingPage.evaluate(()=>window.__releaseFontsForReview());
  await loadingPage.waitForSelector('#page-loader', {state:'hidden'});
  results.loading.afterReady = await loadingPage.evaluate(()=>({
    inert:document.getElementById('page-content').inert,
    busy:document.getElementById('page-content').getAttribute('aria-busy'),
    contentVisible:window.getComputedStyle(document.getElementById('page-content')).visibility,
  }));
  await slow.close();

  const stalled = await browser.newContext();
  await stalled.addInitScript(()=>{ Object.defineProperty(document.fonts,'ready',{value:new Promise(()=>{})}); });
  const stalledPage=await stalled.newPage();
  await stalledPage.goto(source,{waitUntil:'load'});
  await stalledPage.waitForSelector('#page-loader',{state:'visible'});
  await stalledPage.waitForFunction(()=>!document.documentElement.classList.contains('is-preparing'),{},{timeout:6000});
  results.loading.timeout = await stalledPage.evaluate(()=>({elapsedMs:Math.round(window.performance.now()),inert:document.getElementById('page-content').inert,contentVisible:window.getComputedStyle(document.getElementById('page-content')).visibility}));
  await stalled.close();

  const broken = await browser.newContext();
  await broken.addInitScript(()=>{
    document.addEventListener('DOMContentLoaded',()=>{document.querySelector('.brand img').src='assets/missing-logo-test.png';},{once:true});
  });
  const brokenPage=await broken.newPage();
  await brokenPage.goto(source,{waitUntil:'load'});
  await brokenPage.waitForFunction(()=>!document.documentElement.classList.contains('is-preparing'));
  results.loading.logoErrorStillEnters = await brokenPage.locator('h1').isVisible();
  await broken.close();
  results.failures = results.viewports.flatMap((item) => [
    ...(item.scrollWidth > item.width ? [`overflow at ${item.width}`] : []),
    ...item.missingImages,
    ...item.sections.filter((section) => !section.contentInside).map((section) => `content outside ${section.id} at ${item.width}`),
    ...item.sections.filter((section) => item.width > 800 && section.height > item.height + 1).map((section) => `chapter too tall ${section.id} at ${item.width}: ${section.height}`),
    ...(item.values.join('/') !== '利他/专业/效率/创新' ? ['culture values mismatch'] : []),
  ]);
  if(!results.loading.noJsContentVisible || !results.loading.noJsLoaderHidden) results.failures.push('no-JavaScript loading fallback');
  if(!results.loading.pending.inert || results.loading.pending.busy!=='true') results.failures.push('pending content not marked busy');
  if(results.loading.afterReady.inert || results.loading.afterReady.busy!=='false' || results.loading.afterReady.contentVisible!=='visible') results.failures.push('ready content blocked');
  if(results.loading.reducedMotionAnimation!=='none') results.failures.push('loader does not respect reduced motion');
  if(results.loading.timeout.inert || results.loading.timeout.elapsedMs>6000 || results.loading.timeout.contentVisible!=='visible') results.failures.push('loading timeout failed');
  if(!results.loading.logoErrorStillEnters) results.failures.push('broken image blocks loading');
  await writeFile(join(out, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({viewports:results.viewports.map((item)=>({width:item.width,height:item.height,chapterHeights:item.sections.map((section)=>section.height),missingImages:item.missingImages})),failures:results.failures,accessibility:results.accessibility,interactions:results.interactions,loading:results.loading,errors:results.errors},null,2));
  if(results.failures.length || results.errors.length || results.accessibility.some((item)=>item.violations.length)) process.exitCode = 1;
} finally { await browser.close(); }
