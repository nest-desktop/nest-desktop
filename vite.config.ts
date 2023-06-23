// vite.config.ts

// Plugins
import vue from "@vitejs/plugin-vue";

// Vite plugins
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import electron from "vite-plugin-electron";
// import renderer from "vite-plugin-electron-renderer";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./dist", // "./nest_desktop/app"
    chunkSizeWarningLimit: 10000,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    electron([
      {
        entry: "electron/main.ts",
        onstart: (options) => {
          // Start Electron App
          if (process.env["VITE_DEV_ELECTRON_STARTUP"]) {
            options.startup([".", "--no-sandbox"]);
          }
        },
      },
      {
        entry: "electron/preload.ts",
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
      },
    ]),
  ],
  define: {
    global: "window",
    "process.env": {
      APP_VERSION: process.env.npm_package_version,
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@nest": fileURLToPath(new URL("./src/nest", import.meta.url)),
    },
    extensions: [
      ".code",
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue",
    ],
  },
  server: {
    port: 54286,
  },
});
