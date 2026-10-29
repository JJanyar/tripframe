// Build step for search engines and AI crawlers. Text is normally filled in
// by JavaScript; this writes it into the HTML instead, so the pages read fully
// without running scripts. Every site page (home, features, dashcams, how it
// works, questions, privacy) is written once per language (/, /nl/,
// /nl/features/ …) with its own title, description, hreflang links and
// structured data, and a sitemap.xml lists them all. The navigation and footer
// live in src/partials/ and are put into every page here.

import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { LANGS, LOCALE } from './src/locales/langs.js';
import { blogSitemap, localizeLinks, latestCards, loadAll } from './blog.js';

export const SITE = 'https://tripframe.vercel.app';
const REPO = 'https://github.com/JJanyar/tripframe';

/** The site pages; `id` names their strings (meta.<id>.title) and their link in the navigation. */
export const PAGES = [
  { id: 'home', path: '' },
  { id: 'features', path: 'features/' },
  { id: 'dashcams', path: 'dashcams/' },
  { id: 'how', path: 'how-it-works/' },
  { id: 'faq', path: 'faq/' },
  { id: 'privacy', path: 'privacy/' },
];
const FAQ_COUNT = 12;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');
const pageUrl = (lang, path = '') => `${SITE}/${lang === 'en' ? '' : `${lang}/`}${path}`;
const metaKey = (page, field) => (page.id === 'home' ? `meta.${field}` : `meta.${page.id}.${field}`);

export async function loadStrings() {
  const out = {};
  for (const lang of LANGS) {
    const url = pathToFileURL(resolve(import.meta.dirname, `src/locales/${lang}.js`)).href;
    out[lang] = (await import(`${url}?t=${Date.now()}`)).default;
  }
  return out;
}

/** Puts the text of `s` into every data-i18n, data-i18n-html and data-i18n-attr element. */
export function fill(html, s, en) {
  const get = (k) => s[k] ?? en[k] ?? '';
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (_, open, _tag, key, _inner, close) => open + esc(get(key)) + close);
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (_, open, _tag, key, _inner, close) => open + get(key) + close);
  html = html.replace(/<[a-z0-9]+\b[^>]*\bdata-i18n-attr="([^"]+)"[^>]*>/g, (tag, spec) => {
    for (const pair of spec.split(';')) {
      const [name, key] = pair.split(':').map((x) => x.trim());
      const value = attr(get(key));
      const re = new RegExp(`(\\s${name}=")[^"]*(")`);
      tag = re.test(tag) ? tag.replace(re, `$1${value}$2`) : tag.replace(/\sdata-i18n-attr=/, ` ${name}="${value}" data-i18n-attr=`);
    }
    return tag;
  });
  return html;
}

/** Puts the shared navigation and footer into a page, marking the current page in the navigation. */
function partials(html, pageId) {
  const part = (name) => readFileSync(resolve(import.meta.dirname, `src/partials/${name}.html`), 'utf8').trim();
  const nav = part('nav').replace(new RegExp(`(<a [^>]*data-page="${pageId}")`, 'g'), '$1 aria-current="page"');
  return html.replace('<!--nav-->', nav).replace('<!--footer-->', part('footer'));
}

const pageOf = (ctxPath) => {
  const path = ctxPath.replace(/^\//, '').replace(/index\.html$/, '');
  if (path === 'blog/') return 'blog';
  if (path === '404.html') return 'notfound';
  return PAGES.find((p) => p.path === path)?.id ?? null;
};

function structuredData(page, lang, s) {
  const crumbs = (name) => ({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tripframe', item: pageUrl(lang) },
      { '@type': 'ListItem', position: 2, name, item: pageUrl(lang, page.path) },
    ],
  });
  const webPage = { '@type': 'WebPage', name: s[metaKey(page, 'title')], description: s[metaKey(page, 'description')], url: pageUrl(lang, page.path), inLanguage: LOCALE[lang], isPartOf: { '@id': `${SITE}/#website` } };
  if (page.id === 'faq') {
    const faq = Array.from({ length: FAQ_COUNT }, (_, i) => ({
      '@type': 'Question',
      name: s[`h.faq.q${i + 1}`],
      acceptedAnswer: { '@type': 'Answer', text: s[`h.faq.a${i + 1}`] },
    }));
    return { '@context': 'https://schema.org', '@graph': [{ ...webPage, '@type': 'FAQPage', mainEntity: faq }, crumbs(s['h.nav.faq'])] };
  }
  if (page.id !== 'home') {
    const name = s[{ features: 'h.nav.features', dashcams: 'h.nav.dashcams', how: 'h.nav.how', privacy: 'h.nav.privacy' }[page.id]];
    return { '@context': 'https://schema.org', '@graph': [webPage, crumbs(name)] };
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Google takes the site name in search results from this node; without it, it shows "Vercel".
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'Tripframe',
        alternateName: ['Tripframe dashcam viewer', 'tripframe.vercel.app'],
        url: `${SITE}/`,
        inLanguage: LOCALE[lang],
      },
      {
        '@type': 'WebApplication',
        sameAs: [REPO],
        '@id': `${SITE}/#app`,
        name: 'Tripframe',
        url: pageUrl(lang),
        inLanguage: LOCALE[lang],
        description: s['meta.description'],
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Dashcam video viewer',
        operatingSystem: 'Windows, macOS, Linux, ChromeOS (runs in a web browser)',
        browserRequirements: 'Chrome, Edge, Firefox or Safari',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        image: `${SITE}/video/tripframe.jpg`,
        video: {
          '@type': 'VideoObject',
          name: s['h.video.label'],
          description: s['meta.description'],
          thumbnailUrl: `${SITE}/video/tripframe.jpg`,
          contentUrl: `${SITE}/video/tripframe.mp4`,
          uploadDate: '2026-10-26T14:42:00+01:00',
          duration: 'PT20S',
        },
        featureList: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => s[`home.c${n}.t`]).concat([s['h.sync.title'], s['h.frame.title'], s['h.map.title'], s['h.private.title']]),
        keywords: 'dashcam viewer, dashcam player, dash cam footage, Viofo, BlackVue, Thinkware, 70mai, Nextbase, GoPro, front and rear camera, GPS, GPX export, telemetry, SD card, open source',
        codeRepository: REPO,
      },
    ],
  };
}

/** Title, description, canonical, hreflang, Open Graph and JSON-LD for one page in one language. */
function head(html, page, lang, s) {
  const title = s[metaKey(page, 'title')];
  const description = s[metaKey(page, 'description')];
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${attr(description)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${attr(description)}$2`);
  if (page.id !== 'home') html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${attr(title)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl(lang, page.path)}$2`);
  html = html.replace(/<!--seo-->[\s\S]*?<!--\/seo-->\n?/, '');
  const links = [
    `<link rel="canonical" href="${pageUrl(lang, page.path)}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${pageUrl(l, page.path)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl('en', page.path)}" />`,
    `<meta property="og:locale" content="${LOCALE[lang].replace('-', '_')}" />`,
    `<script type="application/ld+json">${JSON.stringify(structuredData(page, lang, s))}</script>`,
  ];
  return html.replace('</head>', `<!--seo-->\n    ${links.join('\n    ')}\n    <!--/seo-->\n  </head>`);
}

const latest = (html, lang, s, all) => html.replace(/<!--latest-->[\s\S]*?<!--\/latest-->/, `<!--latest-->${latestCards(lang, s, all)}<!--/latest-->`);

function sitemap() {
  const urls = PAGES.flatMap((page) => {
    const alt = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l, page.path)}"/>`).join('\n');
    const priority = page.id === 'home' ? 1 : page.id === 'features' || page.id === 'dashcams' ? 0.9 : 0.7;
    return LANGS.map(
      (l) =>
        `  <url>\n    <loc>${pageUrl(l, page.path)}</loc>\n    <changefreq>${page.id === 'home' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${(l === 'en' ? priority : priority - 0.1).toFixed(1)}</priority>\n${alt}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('en', page.path)}"/>\n  </url>`,
    );
  });
  urls.push(`  <url>\n    <loc>${SITE}/app/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
  urls.push(...blogSitemap());
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

export default function seo() {
  let strings;
  let outDir;
  return {
    name: 'tripframe-seo',
    async buildStart() {
      strings = await loadStrings();
    },
    transformIndexHtml: {
      order: 'post',
      async handler(html, ctx) {
        strings ??= await loadStrings();
        const en = strings.en;
        const id = pageOf(ctx.path);
        if (id) html = partials(html, id);
        html = fill(html, en, en);
        const page = PAGES.find((p) => p.id === id);
        if (page) html = head(html, page, 'en', en);
        if (id === 'home') html = latest(html, 'en', en, loadAll());
        if (ctx.path === '/app/index.html') {
          html = html.replace('</head>', `  <link rel="canonical" href="${SITE}/app/" />\n  </head>`);
        }
        return html;
      },
    },
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    // Runs after Vite has written the English pages; the other languages are copies of them.
    closeBundle() {
      const all = loadAll();
      for (const page of PAGES) {
        const file = resolve(outDir, page.path, 'index.html');
        if (!existsSync(file)) continue;
        const base = readFileSync(file, 'utf8');
        for (const lang of LANGS) {
          if (lang === 'en') continue;
          const s = { ...strings.en, ...strings[lang] };
          let html = head(fill(base, s, strings.en), page, lang, s);
          if (page.id === 'home') html = latest(html, lang, s, all);
          mkdirSync(resolve(outDir, lang, page.path), { recursive: true });
          writeFileSync(resolve(outDir, lang, page.path, 'index.html'), localizeLinks(html, lang, all));
        }
      }
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap());
    },
  };
}
