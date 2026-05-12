import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://shashilsravan.github.io/apiwiz-react-challenge/',
  build: {
    minify: 'esbuild',
    target: 'es2020',
    outDir: 'dist',
  },
});