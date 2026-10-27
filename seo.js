// Build step for search engines and AI crawlers. Text is normally filled in
// by JavaScript; this writes it into the HTML instead, so the pages read fully
// without running scripts. The homepage is written once per language
// (/, /nl/, /de/ …) with its own title, description, hreflang links and
// structured data, and a sitemap.xml lists them all.

import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { LANGS, LOCALE } from './src/locales/langs.js';

export const SITE = 'https://tripframe.vercel.app';
const REPO = 'https://github.com/JJanyar/tripframe';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');
const pageUrl = (lang) => (lang === 'en' ? `${SITE}/` : `${SITE}/${lang}/`);

async function loadStrings() {
  const out = {};
  for (const lang of LANGS) {
    const url = pathToFileURL(resolve(import.meta.dirname, `src/locales/${lang}.js`)).href;
    out[lang] = (await import(`${url}?t=${Date.now()}`)).default;
  }
  return out;
}

/** Puts the text of `s` into every data-i18n, data-i18n-html and data-i18n-attr element. */
function fill(html, s, en) {
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

function structuredData(lang, s) {
  const faq = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    '@type': 'Question',
    name: s[`h.faq.q${n}`],
    acceptedAnswer: { '@type': 'Answer', text: s[`h.faq.a${n}`] },
  }));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
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
        featureList: [s['h.moment.title'], s['h.sync.title'], s['h.frame.title'], s['h.map.title'], s['h.private.title']],
        keywords: 'dashcam viewer, dashcam player, dash cam footage, Viofo, BlackVue, Thinkware, 70mai, Nextbase, front and rear camera, GPS, SD card, open source',
        codeRepository: REPO,
      },
      { '@type': 'FAQPage', inLanguage: LOCALE[lang], mainEntity: faq },
    ],
  };
}

/** Title, description, canonical, hreflang, Open Graph and JSON-LD for one language. */
function head(html, lang, s) {
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(s['meta.title'])}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${attr(s['meta.description'])}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${attr(s['meta.description'])}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl(lang)}$2`);
  html = html.replace(/<!--seo-->[\s\S]*?<!--\/seo-->\n?/, '');
  const links = [
    `<link rel="canonical" href="${pageUrl(lang)}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${pageUrl(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl('en')}" />`,
    `<meta property="og:locale" content="${LOCALE[lang].replace('-', '_')}" />`,
    `<script type="application/ld+json">${JSON.stringify(structuredData(lang, s))}</script>`,
  ];
  return html.replace('</head>', `<!--seo-->\n    ${links.join('\n    ')}\n    <!--/seo-->\n  </head>`);
}

function sitemap() {
  const alt = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`).join('\n');
  const urls = LANGS.map((l) => `  <url>\n    <loc>${pageUrl(l)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${l === 'en' ? '1.0' : '0.9'}</priority>\n${alt}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('en')}"/>\n  </url>`);
  urls.push(`  <url>\n    <loc>${SITE}/app/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
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
        html = fill(html, en, en);
        if (ctx.path === '/index.html') html = head(html, 'en', en);
        if (ctx.path === '/app/index.html') {
          html = html.replace('</head>', `  <link rel="canonical" href="${SITE}/app/" />\n  </head>`);
        }
        return html;
      },
    },
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    // Runs after Vite has written the English homepage; the other languages are copies of it.
    closeBundle() {
      const file = resolve(outDir, 'index.html');
      if (!existsSync(file)) return;
      const base = readFileSync(file, 'utf8');
      for (const lang of LANGS) {
        if (lang === 'en') continue;
        mkdirSync(resolve(outDir, lang), { recursive: true });
        writeFileSync(resolve(outDir, lang, 'index.html'), head(fill(base, strings[lang], strings.en), lang, strings[lang]));
      }
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap());
    },
  };
}
