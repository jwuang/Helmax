import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { load } from 'cheerio';
import { buildPages } from '../../scripts/build-pages';

test('Pages publishes the latest concept and only its required assets', () => {
  const out = mkdtempSync(resolve(tmpdir(), 'helmax-pages-'));
  try {
    writeFileSync(resolve(out, 'stale.html'), 'stale output must not be published');
    buildPages(out);
    assert.deepEqual(readdirSync(out).sort(), ['assets', 'index.html', 'robots.txt']);
    assert.deepEqual(readdirSync(resolve(out, 'assets')).sort(), ['helmax-logo.png', 'water-pump.png', 'welding-machine.png']);
    const html = readFileSync(resolve(out, 'index.html'), 'utf8');
    assert.equal(html, readFileSync(new URL('../../docs/design/helmax-exhibition-prototype.html', import.meta.url), 'utf8'));
    const $ = load(html);
    assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow');
    assert.equal(readFileSync(resolve(out, 'robots.txt'), 'utf8'), 'User-agent: *\nDisallow: /\n');

    // Resolve real browser URLs at both a project Pages URL and a custom domain.
    for (const base of ['https://jwuang.github.io/corporate-portal/', 'https://helmax.test/']) {
      $('img[src], script[src], link[href], a[href]').each((_, element) => {
        const value = $(element).attr('src') || $(element).attr('href');
        assert.ok(value);
        const url = new URL(value, base);
        assert.ok(url.href.startsWith(base), `Reference escapes the Pages base: ${value}`);
        if (value.startsWith('#')) {
          assert.equal($('[id]').toArray().some((node) => $(node).attr('id') === url.hash.slice(1)), true, `Missing anchor: ${value}`);
        } else {
          const localPath = url.pathname.slice(new URL(base).pathname.length);
          assert.ok(existsSync(resolve(out, localPath)), `Missing Pages asset: ${value}`);
        }
      });
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
