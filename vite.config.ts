import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves at /<repo>/ — repo name is "GameBuilder".
// VITE_BASE override lets local builds run at "/" if needed.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    base: env.VITE_BASE ?? "/GameBuilder/",
    plugins: [react()],
    build: {
      target: "es2020",
      chunkSizeWarningLimit: 1500
    }
  };
});
