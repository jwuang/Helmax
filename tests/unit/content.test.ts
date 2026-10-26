import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDocuments, readDocuments, type Document } from '../../scripts/validate-content';
import { safeHref } from '../../src/lib/security';
import { visible } from '../../src/lib/content-model';
const sample: Document = { file: 'fixture.md', section: 'services', data: { translationKey: 'discovery', locale: 'zh-cn', routeSlug: 'discovery', title: '需求', summary: '需求梳理', category: '服务', publishedAt: '2026-10-25' }, body: 'A safe document.' };
test('drafts never publish; preview-only entries never enter production', () => {
  for (const production of [false, true]) assert.equal(visible({ draft: true, previewOnly: false }, production), false);
  assert.equal(visible({ draft: false, previewOnly: true }, false), true);
  assert.equal(visible({ draft: false, previewOnly: true }, true), false);
  assert.equal(visible({ draft: false, previewOnly: false }, true), true);
});
test('reject duplicate URLs, duplicate translations and missing source language', () => {
  assert.match(validateDocuments([sample, sample]).join('\n'), /duplicate URL/);
  assert.match(validateDocuments([sample, sample]).join('\n'), /duplicate translation/);
  assert.match(validateDocuments([{ ...sample, data: { ...sample.data, locale: 'en' } }]).join('\n'), /zh-cn source/);
});
test('reject missing images and unescaped HTML in Markdown', () => {
  assert.match(validateDocuments([{ ...sample, data: { ...sample.data, cover: '/images/not-here.png' }, body: '<script>alert(1)</script>' }]).join('\n'), /missing or invalid cover/);
  assert.match(validateDocuments([{ ...sample, body: '<img src=x onerror=alert(1)>' }]).join('\n'), /raw HTML/);
});
test('links reject executable protocols, control characters and URL credential tricks', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,a', '//evil.test', '/\\evil.test', 'java\nscript:a', 'https://user:password@example.test']) assert.throws(() => safeHref(value));
  for (const value of ['/zh-cn/', '#main', 'https://example.test/', 'mailto:hello@example.test', 'tel:+85212345678']) assert.equal(safeHref(value), value);
});
test('repository content is internally consistent', () => assert.deepEqual(validateDocuments(readDocuments()), []));
