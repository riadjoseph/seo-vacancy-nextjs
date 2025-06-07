import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    // proxy: { ... } // Remove or comment this out
  },
  base: "/",
  plugins: [
    react(),
    {
      name: 'generate-404',
      closeBundle: async () => {
        try {
          const distDir = resolve(__dirname, 'dist')
          const source404Path = resolve(__dirname, '404.html') // Source from root
          const notFoundPath = resolve(distDir, '404.html')   // Destination in dist

          // Ensure dist directory exists
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true })
          }

          // Copy 404.html from root to dist
          if (fs.existsSync(source404Path)) {
            fs.copyFileSync(source404Path, notFoundPath)
            console.log('Successfully copied root 404.html to dist/404.html')
          } else {
            console.warn('Root 404.html not found, skipping 404.html generation in dist')
          }
        } catch (error) {
          console.error('Error generating 404.html in dist:', error)
          // Don't fail the build for this error
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@tanstack/react-query'
          ],
          supabase: [
            '@supabase/supabase-js'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 800
  }
})