// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import { VitePWA } from 'vite-plugin-pwa';
//import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  base: './',
  build: {
    outDir: 'new_dist',
    emptyOutDir: true
  },
  plugins: [
    //mkcert(),
    react(), 
    // VitePWA({ 
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: true,
    //   }, 
    //   manifest:{
    //     "name": "IBM quantum computing",
    //     "short_name": "QCaaS",
    //     "start_url": "/RIP_SPA/",
    //     "display": "standalone",
    //     "background_color": "#fdfdfd",
    //     "theme_color": "#db4938",
    //     "orientation": "portrait-primary",
    //     "icons": [
    //       {
    //         "src": "/logo192.png",
    //         "type": "image/png", "sizes": "192x192"
    //       },
    //       {
    //         "src": "/logo512.png",
    //         "type": "image/png", "sizes": "512x512"
    //       }
    //     ]
    //   }
    // })
  ],
  server: {
    port: 5173,
    proxy: {
      // Проксируем все /api и /health на бэкенд
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom'] // предотвращает дублирование
  }
});