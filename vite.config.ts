import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { imagetools } from "vite-imagetools";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode

  const env =
    mode.includes("local") || mode !== "production"
      ? loadEnv(mode, process.cwd(), "")
      : {
          VITE_PROXY_AUTH_URL: "",
          VITE_PROXY_API_URL: "",
          VITE_APP_DOMAIN_URL: "",
        };
  console.log("Mode:", mode);
  console.log("VITE_PROXY_AUTH_URL:", env.VITE_PROXY_AUTH_URL);
  console.log("VITE_PROXY_API_URL:", env.VITE_PROXY_API_URL);
  console.log("VITE_APP_DOMAIN_URL:", env.VITE_APP_DOMAIN_URL);
  return {
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
          target:
            env.VITE_PROXY_AUTH_URL ||
            "https://auth-station-dev-staging.aevatar.ai",
          changeOrigin: true,
          secure: false,
        },
        "/api": {
          target:
            env.VITE_PROXY_API_URL || "https://station-dev-staging.aevatar.ai",
          ws: true,
          changeOrigin: true,
          secure: false,
          rewriteWsOrigin: true,
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
  };
});
