import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/kayaran/',
  envDir: path.resolve(__dirname),
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'Каяран — Турнирная платформа',
        short_name: 'Каяран',
        description: 'Турнирная PWA платформа с LIVE счётом',
        start_url: '/kayaran/',
        scope: '/kayaran/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#8b5cf6',
        lang: 'ru-RU',
        icons: [
          { src: '/kayaran/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/kayaran/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
