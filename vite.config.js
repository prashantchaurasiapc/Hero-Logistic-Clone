import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Reload trigger for env
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/uploads': {
        // target: 'http://localhost:5000',
        target: 'https://hero-logistics-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet', 'jspdf'],
  },
})

