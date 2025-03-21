import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "^(?!/assets|/api).*": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: () => "/index.html"
      }
    }
  },
  base: "/",
  plugins: [
    react(),
    {
      name: 'generate-404',
      closeBundle: async () => {
        try {
          const distDir = resolve(__dirname, 'dist')
          const indexPath = resolve(distDir, 'index.html')
          const notFoundPath = resolve(distDir, '404.html')

          // Ensure dist directory exists
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true })
          }

          // Wait for index.html to be available
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, notFoundPath)
            console.log('Successfully created 404.html')
          } else {
            console.warn('index.html not found, skipping 404.html generation')
          }
        } catch (error) {
          console.error('Error generating 404.html:', error)
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
        manualChunks: undefined
      }
    }
  }
})