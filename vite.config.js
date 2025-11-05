// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs-extra";

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
      }
    }
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        return: resolve(__dirname, "public/return/index.html"),
        admin: resolve(__dirname, "public/admin/index.html")
      }
    }
  }
});