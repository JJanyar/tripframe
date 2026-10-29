// Blog: every Markdown file in blog/posts/ becomes a static page at
// /blog/<file name>/. blog/index.html is the template; the index lists all
// posts. Pages are written at build time, so they read fully without scripts.
// Front matter is plain "key: value" lines between --- markers:
// title, description, date (YYYY-MM-DD), optional updated.

import { resolve } from 'node:path';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const SITE = 'https://tripframe.vercel.app';
const DIR = resolve(import.meta.dirname, 'blog/posts');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nice = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function loadPosts() {
  if (!existsSync(DIR)) return [];
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const src = readFileSync(resolve(DIR, f), 'utf8').replace(/\r\n/g, '\n');
      const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!m) throw new Error(`blog/posts/${f}: missing front matter`);
      const meta = Object.fromEntries(m[1].split('\n').map((l) => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()]));
      for (const k of ['title', 'description', 'date']) if (!meta[k]) throw new Error(`blog/posts/${f}: missing ${k}`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`blog/posts/${f}: date must be YYYY-MM-DD`);
      const words = m[2].split(/\s+/).length;
      return { ...meta, slug: f.replace(/\.md$/, ''), body: marked.parse(m[2]), minutes: Math.max(1, Math.round(words / 220)) };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

const url = (p) => `${SITE}/blog/${p ? `${p.slug}/` : ''}`;

function card(p) {
  return `<li class="post-card"><a href="/blog/${p.slug}/"><time datetime="${p.date}">${nice(p.date)}</time><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p></a></li>`;
}

function indexBody(posts) {
  return `<header class="blog-head"><h1 class="display-2">Dashcam guides</h1><p class="body-l">Buying advice, the software for every major brand, and how to get the most out of your footage. From the people who make Tripframe, a free dashcam viewer that runs in your browser.</p></header>
<ol class="post-list">${posts.map(card).join('')}</ol>`;
}

function postBody(p, posts) {
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  return `<article class="post">
<p class="post-meta"><a href="/blog/">Blog</a><span aria-hidden="true">/</span><time datetime="${p.updated || p.date}">${nice(p.updated || p.date)}</time><span aria-hidden="true">/</span>${p.minutes} min read</p>
<h1 class="headline">${esc(p.title)}</h1>
<p class="post-lead">${esc(p.description)}</p>
<div class="prose">${p.body}</div>
<aside class="post-cta inverse"><p><strong>Tripframe</strong> opens your dashcam's SD card in the browser: every clip by day and time, front and rear in sync, frame by frame. Free, no account, nothing is uploaded.</p><a class="btn btn-primary btn-large" href="/app/">Open your dashcam folder</a></aside>
</article>
<nav class="post-more" aria-label="More posts"><h2 class="headline">Keep reading</h2><ol class="post-list">${more.map(card).join('')}</ol></nav>`;
}

function head(title, description, canonical, ld) {
  return `<title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <link rel="canonical" href="${canonical}" />
    <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

const publisher = { '@type': 'Organization', name: 'Tripframe', url: `${SITE}/`, logo: `${SITE}/icon-512.png` };

function indexHead(posts) {
  return head('Dashcam guides and reviews | Tripframe blog', 'Dashcam buying guides, the best SD cards, and how to view footage from Viofo, BlackVue, Thinkware, Nextbase, 70mai, Garmin and more on your computer.', url(), {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Tripframe blog',
    url: url(),
    publisher,
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: url(p), datePublished: p.date })),
  });
}

function postHead(p) {
  return head(`${p.title} | Tripframe`, p.description, url(p), {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.description,
        url: url(p),
        mainEntityOfPage: url(p),
        datePublished: p.date,
        dateModified: p.updated || p.date,
        inLanguage: 'en',
        image: `${SITE}/video/tripframe.jpg`,
        author: publisher,
        publisher,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Tripframe', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: url() },
          { '@type': 'ListItem', position: 3, name: p.title, item: url(p) },
        ],
      },
    ],
  });
}

const swap = (html, mark, content) => html.replace(new RegExp(`<!--${mark}-->[\\s\\S]*?<!--/${mark}-->`), `<!--${mark}-->${content}<!--/${mark}-->`);

export default function blog() {
  let outDir;
  return {
    name: 'tripframe-blog',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html, ctx) {
      if (ctx.path !== '/blog/index.html') return html;
      const posts = loadPosts();
      return swap(swap(html, 'head', indexHead(posts)), 'blog', indexBody(posts));
    },
    // shortcut: post pages exist only in the build (npm run build && npm run preview), not in npm run dev.
    closeBundle() {
      const file = resolve(outDir, 'blog/index.html');
      if (!existsSync(file)) return;
      const base = readFileSync(file, 'utf8');
      const posts = loadPosts();
      for (const p of posts) {
        mkdirSync(resolve(outDir, 'blog', p.slug), { recursive: true });
        writeFileSync(resolve(outDir, 'blog', p.slug, 'index.html'), swap(swap(base, 'head', postHead(p)), 'blog', postBody(p, posts)));
      }
    },
  };
}
