import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  optimizeDeps: {
    include: ['js-cookie'],
  },
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Explicit ESM entry for js-cookie (avoids import-analysis resolution issues)
      'js-cookie': path.resolve(__dirname, 'node_modules/js-cookie/dist/js.cookie.mjs'),
    },
  },
})
