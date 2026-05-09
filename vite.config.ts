import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { cloudflare } from "@cloudflare/vite-plugin";

// Default to root-domain hosting (Cloudflare Pages, custom domains, dev).
// The GitHub Pages workflow sets VITE_BASE=/GameBuilder/ when it builds,
// since that hosts under /<repo>/.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    base: env.VITE_BASE ?? "/",
    plugins: [react(), cloudflare()],
    build: {
      target: "es2020",
      chunkSizeWarningLimit: 1500
    }
  };
});