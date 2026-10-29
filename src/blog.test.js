// npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { unquote, localizeLinks } from '../blog.js';

test('front matter values may be quoted', () => {
  assert.equal(unquote('Plain title'), 'Plain title');
  assert.equal(unquote('"Tela preta ou \\"erro\\"?"'), 'Tela preta ou "erro"?');
  assert.equal(unquote("'It''s fine'"), "It's fine");
  assert.equal(unquote('"half'), '"half');
});

test('links point at the translation when it exists', () => {
  const all = { en: [{ slug: 'a' }, { slug: 'b' }], nl: [{ slug: 'a' }] };
  const html = '<a href="/">x</a><a href="/#faq">x</a><a href="/blog/">x</a><a href="/blog/a/">x</a><a href="/blog/b/">x</a><a href="/app/">x</a>';
  assert.equal(
    localizeLinks(html, 'nl', all),
    '<a href="/nl/">x</a><a href="/nl/#faq">x</a><a href="/nl/blog/">x</a><a href="/nl/blog/a/">x</a><a href="/blog/b/">x</a><a href="/app/">x</a>',
  );
  assert.equal(localizeLinks(html, 'en', all), html);
});
