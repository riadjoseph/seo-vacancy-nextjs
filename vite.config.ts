import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

export default defineConfig(({ mode }) => ({
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
    mode === 'development' && componentTagger(),
    {
      name: 'generate-404',
      closeBundle() {
        // Copy index.html to 404.html in dist folder
        fs.copyFileSync(
          path.resolve(__dirname, 'dist/index.html'),
          path.resolve(__dirname, 'dist/404.html')
        );
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
}));