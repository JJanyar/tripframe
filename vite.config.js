import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import seo from './seo.js';

// Two pages: the homepage at / (plus one copy per language, written by seo.js) and the app at /app/.
export default defineConfig({
  plugins: [seo()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        app: resolve(import.meta.dirname, 'app/index.html'),
      },
    },
  },
});
