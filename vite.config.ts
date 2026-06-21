import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
    // Don't emit the inline module-preload polyfill <script>; we target
    // browsers with native modulepreload, and a strict CSP forbids inline
    // scripts. Keeps the prod HTML free of un-nonced inline scripts.
    modulePreload: { polyfill: false },
  },
  ssr: {
    noExternal: ['react-router'],
  },
});
