import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { parseServerOptions, resolvePageRequest } from '../../scripts/serve-pages';

test('Website routing supports root and project URLs, redirects directories, and keeps missing routes as 404', () => {
  const root = mkdtempSync(resolve(tmpdir(), 'helmax-server-'));
  try {
    writeFileSync(resolve(root, 'index.html'), '<h1>Helmax</h1>');
    writeFileSync(resolve(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
    mkdirSync(resolve(root, 'assets'));
    writeFileSync(resolve(root, 'assets/logo.png'), 'image');
    for (const locale of ['zh-cn', 'zh-hk', 'en']) {
      mkdirSync(resolve(root, locale));
      writeFileSync(resolve(root, locale, 'index.html'), `<html lang="${locale}"></html>`);
    }
    for (const prefix of ['', '/corporate-portal']) {
      for (const page of ['/', '/zh-cn/', '/zh-hk/', '/en/']) {
        assert.deepEqual(resolvePageRequest(`${prefix}${page}?preview=true`, root), {
          status: 200,
          file: resolve(root, `.${page}`, 'index.html'),
          contentType: 'text/html; charset=utf-8',
        });
      }
      for (const locale of ['zh-cn', 'zh-hk', 'en']) {
        assert.deepEqual(resolvePageRequest(`${prefix}/${locale}?preview=true`, root), {
          status: 301, location: `${prefix}/${locale}/?preview=true`,
        });
      }
      assert.equal(resolvePageRequest(`${prefix}/missing`, root).status, 404);
      assert.equal(resolvePageRequest(`${prefix}/en/missing`, root).status, 404);
      assert.equal(resolvePageRequest(`${prefix}/assets/`, root).status, 404);
      assert.deepEqual(resolvePageRequest(`${prefix}/assets/logo.png`, root), {
        status: 200, file: resolve(root, 'assets/logo.png'), contentType: 'image/png',
      });
      assert.deepEqual(resolvePageRequest(`${prefix}/robots.txt`, root), {
        status: 200, file: resolve(root, 'robots.txt'), contentType: 'text/plain; charset=utf-8',
      });
    }
    assert.deepEqual(resolvePageRequest('/corporate-portal?preview=true', root), {
      status: 301, location: '/corporate-portal/?preview=true',
    });
    assert.equal(resolvePageRequest('/corporate-portal-other/en/', root).status, 404);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('Website routing rejects raw and encoded traversal, malformed paths, hidden files, and symlink escapes', () => {
  const fixture = mkdtempSync(resolve(tmpdir(), 'helmax-server-security-'));
  const root = resolve(fixture, 'public');
  try {
    mkdirSync(root);
    writeFileSync(resolve(fixture, 'private.txt'), 'private');
    writeFileSync(resolve(root, '.env'), 'private');
    symlinkSync(resolve(fixture, 'private.txt'), resolve(root, 'linked.txt'));
    symlinkSync(fixture, resolve(root, 'linked-directory'));
    mkdirSync(resolve(root, 'linked-index'));
    symlinkSync(resolve(fixture, 'private.txt'), resolve(root, 'linked-index/index.html'));
    for (const path of [
      '/../private.txt', '/%2e%2e/private.txt', '/en/%2e%2e/%2e%2e/private.txt',
      '/corporate-portal/../private.txt', '/corporate-portal/%2e%2e%2fprivate.txt',
      '/.env', '/%2eenv', '/linked.txt', '/linked-directory/private.txt', '/linked-index/',
    ]) assert.equal(resolvePageRequest(path, root).status, 403, path);
    for (const path of ['/%zz', '/%00', '/%0a', '/..%5cprivate.txt', '//example.com/file', 'https://example.com/']) {
      assert.equal(resolvePageRequest(path, root).status, 400, path);
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('Website server defaults to loopback and validates explicit host and port options', () => {
  assert.deepEqual(parseServerOptions([]), { host: '127.0.0.1', port: 4321, watch: false });
  assert.deepEqual(parseServerOptions(['--watch', '--host', '0.0.0.0', '--port', '4322']), {
    host: '0.0.0.0', port: 4322, watch: true,
  });
  for (const args of [['--port'], ['--port', '0'], ['--port', '65536'], ['--port', '1.5'], ['--host'], ['--unknown']]) {
    assert.throws(() => parseServerOptions(args));
  }
});
