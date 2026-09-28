import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/connect4/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: 'site/index.html',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
