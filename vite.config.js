import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Two pages: the homepage at / and the app at /app/.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        app: resolve(import.meta.dirname, 'app/index.html'),
      },
    },
  },
});
