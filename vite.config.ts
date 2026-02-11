import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caching
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', 'postprocessing'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'utils': ['zustand', 'clsx', 'tailwind-merge'],
        }
      }
    },
    // Aumentar límite de warning (temporal hasta optimizar más)
    chunkSizeWarningLimit: 600,
  }
})
