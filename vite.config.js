import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/dopplermap_ui/',
    plugins: [
      react(),
      {
        name: 'add-version-to-assets',
        transformIndexHtml(html) {
          const timestamp = Date.now();
          return html.replace(
            /(src|href)="\/doppler_ui\/assets\/([^"]+)"/g,
            `$1="/doppler_ui/assets/$2?v=${timestamp}"`
          );
        }
      }
    ],
    build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  }
})
