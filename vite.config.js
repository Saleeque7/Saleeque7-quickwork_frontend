// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/quickwork': {
        target: 'https://www.saleeque.online',
        changeOrigin: true,
        secure: true,
      },
    },
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    include: ['react-easy-crop'],
  },
});


