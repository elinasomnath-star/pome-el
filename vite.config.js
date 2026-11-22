import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Dev server needs '/' for absolute module resolution; production build can use './' or VITE_BASE_PATH for GitHub Pages
  base: command === 'serve' ? '/' : (process.env.VITE_BASE_PATH || './'),
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  test: {
    globals: true,
    environment: 'node'
  }
}));
