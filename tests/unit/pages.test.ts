import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { load } from 'cheerio';
import { buildPages } from '../../scripts/build-pages';

test('Pages publishes three complete language pages and only the required display assets', () => {
  const out = mkdtempSync(resolve(tmpdir(), 'helmax-pages-'));
  try {
    writeFileSync(resolve(out, 'stale.html'), 'stale output must not be published');
    buildPages(out);
    assert.deepEqual(readdirSync(out).sort(), ['assets', 'en', 'index.html', 'robots.txt', 'zh-cn', 'zh-hk']);
    assert.deepEqual(readdirSync(resolve(out, 'assets')).sort(), ['helmax-logo.png', 'water-pump.png', 'welding-machine.png']);
    assert.equal(readFileSync(resolve(out, 'robots.txt'), 'utf8'), 'User-agent: *\nDisallow: /\n');
    for (const [route, language, title, values, loading] of [
      ['', 'zh-CN', '以专业，成就彼此。', '利他/专业/效率/创新', '正在准备'],
      ['zh-cn/', 'zh-CN', '以专业，成就彼此。', '利他/专业/效率/创新', '正在准备'],
      ['zh-hk/', 'zh-HK', '以專業，成就彼此。', '利他/專業/效率/創新', '正在準備'],
      ['en/', 'en', 'Expertise thatmoves us forward.', 'Altruism/Expertise/Efficiency/Innovation', 'Getting ready'],
    ]) {
      const $ = load(readFileSync(resolve(out, route!, 'index.html'), 'utf8'));
      assert.equal($('html').attr('lang'), language);
      assert.equal($('h1').text(), title);
      assert.equal($('.value h3').map((_, element) => $(element).text()).get().join('/'), values);
      assert.equal($('.loader-label').text(), loading);
      assert.equal($('.chapter').length, 6);
      assert.equal($('.product').length, 4);
      assert.equal($('#home-translations, #prototype-i18n').length, 0, 'Published language must work without a translation script');
      assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow');
      assert.ok($('title').text().includes('Helmax'));
      assert.doesNotMatch($('title').text() + $('.footer').text(), /概念稿|concept|subject to review/iu);
      assert.ok($('meta[name="description"]').attr('content'));
      const current = $('.language-options a[aria-current="page"]');
      assert.equal(current.length, 1);
      assert.equal(current.attr('lang'), language);

      // Exercise complete navigation at both a project Pages URL and a custom domain.
      for (const base of ['https://jwuang.github.io/corporate-portal/', 'https://helmax.test/']) {
        const pageUrl = new URL(route!, base);
        $('img[src], script[src], link[href], a[href]').each((_, element) => {
          const value = $(element).attr('src') || $(element).attr('href');
          assert.ok(value);
          const url = new URL(value, pageUrl);
          assert.ok(url.href.startsWith(base), `Reference escapes the Pages base: ${route}${value}`);
          const localPath = url.pathname.slice(new URL(base).pathname.length);
          const file = resolve(out, localPath, url.pathname.endsWith('/') ? 'index.html' : '');
          assert.ok(existsSync(file), `Missing Pages target: ${route}${value}`);
          if (url.hash) {
            const target = load(readFileSync(file, 'utf8'));
            assert.ok(target('[id]').toArray().some((node) => target(node).attr('id') === url.hash.slice(1)), `Missing anchor: ${value}`);
          }
          if ($(element).attr('hreflang')) {
            const target = load(readFileSync(file, 'utf8'));
            assert.equal(target('html').attr('lang'), $(element).attr('hreflang'));
          }
        });
      }
      if (language === 'en') {
        $('script, style, .language-options').remove();
        assert.doesNotMatch($('body').text(), /[\u3400-\u9fff]/u, 'English body contains untranslated Chinese');
        $('[alt], [aria-label], [data-title], meta[name="description"]').each((_, element) => {
          for (const attribute of ['alt', 'aria-label', 'data-title', 'content']) {
            assert.doesNotMatch($(element).attr(attribute) || '', /[\u3400-\u9fff]/u);
          }
        });
      }
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('Standalone homepage translations cover every text and accessibility binding', () => {
  const $ = load(readFileSync(new URL('../../docs/design/helmax-exhibition-prototype.html', import.meta.url), 'utf8'));
  const dictionaries = JSON.parse($('#home-translations').text()) as Record<string, Record<string, string>>;
  const keys = new Set<string>();
  for (const attribute of [null, 'aria-label', 'alt', 'data-title', 'content']) {
    const binding = attribute ? `data-i18n-${attribute}` : 'data-i18n';
    $(`[${binding}]`).each((_, element) => {
      const key = $(element).attr(binding)!;
      keys.add(key);
      for (const locale of ['zh-cn', 'zh-hk', 'en']) {
        assert.ok(dictionaries[locale]?.[key]?.trim(), `Missing translation: ${locale}.${key}`);
      }
      assert.equal(attribute ? $(element).attr(attribute) : $(element).text().trim(), dictionaries['zh-cn']![key]);
    });
  }
  assert.deepEqual(Object.keys(dictionaries).sort(), ['en', 'zh-cn', 'zh-hk']);
  for (const dictionary of Object.values(dictionaries)) assert.deepEqual(Object.keys(dictionary).sort(), [...keys].sort());
});
