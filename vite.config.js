// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import fs from "fs-extra";

// Helper to replace __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-public",
      closeBundle() {
        const src = resolve(__dirname, "public");
        const dest = resolve(__dirname, "dist/public");
        fs.copySync(src, dest, { overwrite: true });
        console.log("Copied public/ → dist/public");
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // ONLY ONE ENTRY POINT
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});