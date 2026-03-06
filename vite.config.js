import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'legacy-js-api',
          'import',
          'global-builtin',
          'color-functions',
          'mixed-decls',
          'slash-div',
          'abs-percent',
          'if-function',
        ],
      },
    },
  },
});
