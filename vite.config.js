import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    "process.env": {},
  },
  build: {
    lib: {
      entry: "src/main.jsx",
      name: "VideoSubtitlerFront",
      fileName: "video-subtitler-front",
      formats: ["iife"],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    exclude: [...configDefaults.exclude, "e2e/*"],
  },
});
