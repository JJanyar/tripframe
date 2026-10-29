import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import seo from './seo.js';
import blog from './blog.js';

// The site pages (each with a copy per language, written by seo.js), the app at /app/, the blog at
// /blog/ (plus one page per post and language, written by blog.js) and the page shown for unknown addresses.
const page = (path) => resolve(import.meta.dirname, path, 'index.html');
export default defineConfig({
  plugins: [seo(), blog()],
  build: {
    rollupOptions: {
      input: {
        home: page('.'),
        features: page('features'),
        dashcams: page('dashcams'),
        how: page('how-it-works'),
        faq: page('faq'),
        privacy: page('privacy'),
        app: page('app'),
        blog: page('blog'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
