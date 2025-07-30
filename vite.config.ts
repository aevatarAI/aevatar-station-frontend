import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig((_config) => ({
  // build: {
  //   terserOptions: {
  //     compress: {
  //       drop_console: false,
  //       drop_debugger: true,
  //     },
  //   },
  // },
  plugins: [nodePolyfills(), react({}), svgr(), imagetools(), tailwindcss()],

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
        target: "https://auth-station-dev-staging.aevatar.ai",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "https://station-dev-staging.aevatar.ai/developer-client",
        ws: true,
        changeOrigin: true,
        secure: false,
        rewriteWsOrigin: true,
      },
      "/agent-api": {
        target: "https://station-developer-staging.aevatar.ai/sdk-client",
        ws: true,
        changeOrigin: true,
        secure: false,
        rewriteWsOrigin: true,
        rewrite: (path) => path.replace(/^\/agent-api/, ""),
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
