import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  build: {
    outDir: '../admin',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/app.[ext]',
      },
    },
  },
  plugins: [react()],
});
