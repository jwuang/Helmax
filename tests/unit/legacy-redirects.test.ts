import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { load } from 'cheerio';
import { buildLegacyRedirects } from '../../scripts/build-legacy-redirects';

test('Legacy URLs retain their language, query and chapter when redirected to Cloudflare', () => {
  const out = mkdtempSync(join(tmpdir(), 'helmax-redirects-'));
  try {
    buildLegacyRedirects(out);
    assert.deepEqual(readdirSync(out).sort(), ['.nojekyll', 'en', 'index.html', 'robots.txt', 'zh-cn', 'zh-hk']);
    for (const locale of ['', 'zh-cn', 'zh-hk', 'en']) {
      const target = `https://helmax.1143402012.workers.dev/${locale ? `${locale}/` : ''}`;
      const $ = load(readFileSync(join(out, locale, 'index.html'), 'utf8'));
      assert.equal($('a').attr('href'), target);
      assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow');
      assert.ok($('noscript').html()?.includes(`url=${target}`));
      let destination = '';
      runInNewContext($('script').text(), { location: {
        search: '?ref=bookmark', hash: '#products',
        replace: (url: string) => { destination = url; },
      } });
      assert.equal(destination, `${target}?ref=bookmark#products`);
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
