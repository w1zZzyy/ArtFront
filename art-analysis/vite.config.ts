import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs'
import path from 'path'

export default defineConfig({
  base: '/ArtFront/', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',       // автообновление сервис-воркера
      devOptions: {
        enabled: true,
      }, 
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Art Analysis',
        short_name: 'ArtAnalysis',
        description: 'Приложение для анализа и выбора экспертов',
        theme_color: '#000000',
        background_color: '#F4F4F4',
        display: 'standalone',          // standalone делает PWA как отдельное приложение
        start_url: '/ArtFront/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    /* https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    }, */
    port: 5173,
    proxy: {
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