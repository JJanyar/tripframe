// Blog: every Markdown file in blog/posts/ becomes a static page at
// /blog/<file name>/; translations live in blog/posts/<lang>/ with the same
// file name and become /<lang>/blog/<file name>/. blog/index.html is the
// template (navigation and footer shared with the homepage); each language
// with posts gets its own index. Pages are written at build time, so they read
// fully without scripts. Front matter is plain "key: value" lines between ---
// markers: title, description, date (YYYY-MM-DD), optional updated.

import { resolve } from 'node:path';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';
import { LANGS, LOCALE } from './src/locales/langs.js';
import { SITE, fill, loadStrings } from './seo.js';

const DIR = resolve(import.meta.dirname, 'blog/posts');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const prefix = (lang) => (lang === 'en' ? '' : `/${lang}`);
const url = (lang, slug) => `${SITE}${prefix(lang)}/blog/${slug ? `${slug}/` : ''}`;
const niceDate = (d, lang) => new Date(`${d}T12:00:00Z`).toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const slugify = (s) => stripTags(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'section';

/** Gives every h2 an id and returns the table of contents built from them. */
function withToc(html) {
  const toc = [];
  const seen = new Set();
  const body = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    let id = slugify(inner);
    for (let n = 2; seen.has(id); n++) id = `${slugify(inner)}-${n}`;
    seen.add(id);
    toc.push({ id, label: stripTags(inner) });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { body, toc };
}

// Values may be quoted as in YAML: "double" (with \" escapes) or 'single' (with '' for a quote).
export function unquote(v) {
  if (/^".*"$/.test(v)) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1);
    }
  }
  return /^'.*'$/.test(v) ? v.slice(1, -1).replace(/''/g, "'") : v;
}

function readPost(file, slug) {
  const src = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const meta = Object.fromEntries(m[1].split('\n').map((l) => [l.slice(0, l.indexOf(':')).trim(), unquote(l.slice(l.indexOf(':') + 1).trim())]));
  for (const k of ['title', 'description', 'date']) if (!meta[k]) throw new Error(`${file}: missing ${k}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: date must be YYYY-MM-DD`);
  return { ...meta, slug, words: m[2].split(/\s+/).length, ...withToc(marked.parse(m[2])) };
}

/** Posts per language: { en: [...], nl: [...] }, newest first. Read time comes from the English text. */
export function loadAll() {
  const list = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')) : []);
  const en = list(DIR).map((f) => readPost(resolve(DIR, f), f.slice(0, -3)));
  const minutes = Object.fromEntries(en.map((p) => [p.slug, Math.max(1, Math.round(p.words / 220))]));
  const all = { en };
  for (const lang of LANGS.filter((l) => l !== 'en')) {
    all[lang] = list(resolve(DIR, lang)).map((f) => {
      const slug = f.slice(0, -3);
      if (!minutes[slug]) throw new Error(`blog/posts/${lang}/${f}: no English post with this name`);
      return readPost(resolve(DIR, lang, f), slug);
    });
  }
  for (const lang of LANGS) {
    all[lang].forEach((p) => (p.minutes = minutes[p.slug]));
    all[lang].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  }
  return all;
}

const has = (all, lang, slug) => (slug ? all[lang].some((p) => p.slug === slug) : all[lang].length > 0);

/**
 * Points site links in a page of `lang` at that language's pages: / and /#x to /<lang>/,
 * /blog/… to /<lang>/blog/… when that translation exists. /app/ is shared by all languages.
 */
export function localizeLinks(html, lang, all = loadAll()) {
  if (lang === 'en') return html;
  return html.replace(/(<a\b[^>]*?\shref=")(\/[^"]*)"/g, (tag, open, path) => {
    if (path === '/' || path.startsWith('/#')) return `${open}/${lang}${path}"`;
    const m = path.match(/^\/blog\/([^/#]*)\/?(#.*)?$/);
    if (m && has(all, lang, m[1])) return `${open}/${lang}${path}"`;
    return tag;
  });
}

function card(p, lang, s) {
  return `<li class="post-card"><a href="/blog/${p.slug}/"><p class="post-card-meta"><time datetime="${p.date}">${niceDate(p.date, lang)}</time><span aria-hidden="true">·</span><span>${s['b.read'].replace('{n}', p.minutes)}</span></p><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p></a></li>`;
}

function indexBody(posts, lang, s) {
  return `<header class="blog-head"><h1 class="display-2">${esc(s['b.title'])}</h1><p class="body-l">${esc(s['b.intro'])}</p></header>
<ol class="post-list">${posts.map((p) => card(p, lang, s)).join('')}</ol>`;
}

function postBody(p, posts, lang, s) {
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  const day = p.updated || p.date;
  return `<div class="post-layout">
<article class="post">
<p class="post-meta"><a href="/blog/">${esc(s['h.nav.blog'])}</a><span aria-hidden="true">/</span><time datetime="${day}">${niceDate(day, lang)}</time><span aria-hidden="true">/</span><span>${s['b.read'].replace('{n}', p.minutes)}</span></p>
<h1 class="headline">${esc(p.title)}</h1>
<p class="post-lead">${esc(p.description)}</p>
<div class="prose">${p.body}</div>
<aside class="post-cta inverse"><p>${esc(s['b.cta'])}</p><a class="btn btn-primary btn-large" href="/app/">${esc(s['h.cta'])}</a></aside>
</article>
${p.toc.length > 1 ? `<nav class="toc" aria-labelledby="toc-title"><p class="toc-title" id="toc-title">${esc(s['b.toc'])}</p><div class="toc-track"><span class="toc-indicator" aria-hidden="true"></span><ol>${p.toc.map((h) => `<li><a href="#${h.id}">${esc(h.label)}</a></li>`).join('')}</ol></div></nav>` : ''}
</div>
<nav class="post-more" aria-labelledby="more-title"><h2 class="headline" id="more-title">${esc(s['b.more'])}</h2><ol class="post-list">${more.map((x) => card(x, lang, s)).join('')}</ol></nav>`;
}

function head({ title, description, lang, slug, all, ld }) {
  const langs = LANGS.filter((l) => has(all, l, slug));
  return `<title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url(lang, slug)}" />
    <meta property="og:locale" content="${LOCALE[lang].replace('-', '_')}" />
    <link rel="canonical" href="${url(lang, slug)}" />
    ${langs.map((l) => `<link rel="alternate" hreflang="${l}" href="${url(l, slug)}" />`).join('\n    ')}
    <link rel="alternate" hreflang="x-default" href="${url('en', slug)}" />
    <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

// A function: SITE comes from seo.js, which imports this file, so it is not set yet while this module loads.
const publisher = () => ({ '@type': 'Organization', name: 'Tripframe', url: `${SITE}/`, logo: `${SITE}/icon-512.png` });

function indexHead(lang, s, all) {
  return head({
    title: s['b.metaTitle'],
    description: s['b.metaDesc'],
    lang,
    slug: '',
    all,
    ld: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: s['b.metaTitle'],
      url: url(lang),
      inLanguage: LOCALE[lang],
      publisher: publisher(),
      blogPost: all[lang].map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: url(lang, p.slug), datePublished: p.date })),
    },
  });
}

function postHead(p, lang, s, all) {
  return head({
    title: `${p.title} | Tripframe`,
    description: p.description,
    lang,
    slug: p.slug,
    all,
    ld: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.description,
          url: url(lang, p.slug),
          mainEntityOfPage: url(lang, p.slug),
          datePublished: p.date,
          dateModified: p.updated || p.date,
          inLanguage: LOCALE[lang],
          timeRequired: `PT${p.minutes}M`,
          image: `${SITE}/video/tripframe.jpg`,
          author: publisher(),
          publisher: publisher(),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Tripframe', item: `${SITE}${prefix(lang)}/` },
            { '@type': 'ListItem', position: 2, name: s['h.nav.blog'], item: url(lang) },
            { '@type': 'ListItem', position: 3, name: p.title, item: url(lang, p.slug) },
          ],
        },
      ],
    },
  });
}

/** <url> entries for every blog page in every language, with hreflang alternates. */
export function blogSitemap() {
  const all = loadAll();
  const entry = (lang, slug, lastmod, priority) => {
    const alt = LANGS.filter((l) => has(all, l, slug)).map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l, slug)}"/>`);
    return `  <url>\n    <loc>${url(lang, slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n${alt.join('\n')}\n  </url>`;
  };
  return LANGS.filter((l) => has(all, l)).flatMap((l) => [entry(l, '', all[l][0].date, '0.8'), ...all[l].map((p) => entry(l, p.slug, p.updated || p.date, '0.7'))]);
}

const swap = (html, mark, content) => html.replace(new RegExp(`<!--${mark}-->[\\s\\S]*?<!--/${mark}-->`), `<!--${mark}-->${content}<!--/${mark}-->`);

export default function blog() {
  let outDir;
  return {
    name: 'tripframe-blog',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async transformIndexHtml(html, ctx) {
      if (ctx.path !== '/blog/index.html') return html;
      const all = loadAll();
      const s = (await loadStrings()).en;
      return swap(swap(html, 'head', indexHead('en', s, all)), 'blog', indexBody(all.en, 'en', s));
    },
    // shortcut: post pages and other languages exist only in the build (npm run build && npm run preview), not in npm run dev.
    async closeBundle() {
      const file = resolve(outDir, 'blog/index.html');
      if (!existsSync(file)) return;
      const template = readFileSync(file, 'utf8');
      const strings = await loadStrings();
      const all = loadAll();
      for (const lang of LANGS.filter((l) => has(all, l))) {
        const s = { ...strings.en, ...strings[lang] };
        const base = fill(template, s, strings.en).replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
        const write = (slug, html) => {
          const dir = resolve(outDir, ...(lang === 'en' ? [] : [lang]), 'blog', slug);
          mkdirSync(dir, { recursive: true });
          writeFileSync(resolve(dir, 'index.html'), localizeLinks(html, lang, all));
        };
        if (lang !== 'en') write('', swap(swap(base, 'head', indexHead(lang, s, all)), 'blog', indexBody(all[lang], lang, s)));
        for (const p of all[lang]) write(p.slug, swap(swap(base, 'head', postHead(p, lang, s, all)), 'blog', postBody(p, all[lang], lang, s)));
      }
    },
  };
}
