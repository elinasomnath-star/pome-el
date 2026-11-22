import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative base './' or repo path for GitHub Pages compatibility (Requirement 16)
  base: process.env.VITE_BASE_PATH || './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  test: {
    globals: true,
    environment: 'node'
  }
});
