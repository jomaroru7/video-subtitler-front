import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: "src/main.jsx",
      name: "VideoSubtitlerFront",
      fileName: "video-subtitler-front",
      formats: ["iife"],
    }
  }
})
