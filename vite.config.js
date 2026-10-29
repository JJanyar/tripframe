import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import seo from './seo.js';
import blog from './blog.js';

// Three pages: the homepage at / (plus one copy per language, written by seo.js), the app at /app/
// and the blog at /blog/ (plus one page per post, written by blog.js).
export default defineConfig({
  plugins: [seo(), blog()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        app: resolve(import.meta.dirname, 'app/index.html'),
        blog: resolve(import.meta.dirname, 'blog/index.html'),
      },
    },
  },
});
