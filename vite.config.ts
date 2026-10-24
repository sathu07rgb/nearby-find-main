import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/nearby-find-main/' : '/',
  plugins: [
    react(),
    {
      name: 'copy-404-for-github-pages',
      closeBundle() {
        const distIndex = path.resolve(__dirname, 'dist/index.html')
        const dist404 = path.resolve(__dirname, 'dist/404.html')
        if (fs.existsSync(distIndex)) {
          fs.copyFileSync(distIndex, dist404)
        }
      },
    },
  ],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
