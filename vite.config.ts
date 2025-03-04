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
      "@": config.mode === "production" ? __dirname : resolve(__dirname, "./src"),
    },
  },

  optimizeDeps: {
    // disabled: false,
    include: [],
    exclude: ["coverage"],
  },

  server: {
    proxy: {
      "/connect": {
        target: "https://auth-station-staging.aevatar.ai",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
