import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/', // Make sure this is set correctly, or adjust if hosted on a subdirectory
  build: {
    outDir: 'dist', // Ensure Vite outputs to the correct folder (which is the default)
  },
});
