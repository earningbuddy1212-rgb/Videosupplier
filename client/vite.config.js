import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set `base` to your repo name for GitHub Pages (repository pages)
export default defineConfig({
  base: '/Videosupplier/',
  plugins: [react()],
  server: {
    port: 5173,
  }
})
