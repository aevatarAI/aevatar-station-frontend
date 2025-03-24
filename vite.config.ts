import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig((config) => ({
  plugins: [nodePolyfills(), react({}), svgr(), imagetools()],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  optimizeDeps: {
    // disabled: false,
    include: [],
    exclude: ["coverage"],
  },

  server: {
    allowedHosts: true,
    proxy: {
      "/connect": {
        target: "https://auth-station-staging.aevatar.ai",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "https://station-developer-staging.aevatar.ai/developer-client",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    coverage: {
      provider: "v8",
    },
    exclude: [
      "**/node_modules/**",
      "**/types/**",
      "**/constants/**",
      "**/assets/**",
    ],
    environment: "happy-dom",
    setupFiles: ["./vitest.setup"],
  },
}));
