// vite.config.ts

// Plugins
import vue from "@vitejs/plugin-vue";

// Vite plugins
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import electron from "vite-plugin-electron";
import { VitePWA } from "vite-plugin-pwa";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 10000,
    outDir: "./dist", // "./nest_desktop/app",
    // https://stackoverflow.com/questions/71180561/vite-change-ouput-directory-of-assets
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: any) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          } else if (/woff|woff2|eot|ttf|otf/.test(extType)) {
            extType = "fonts";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },
  define: {
    global: "window",
    "process.env": {
      APP_VERSION: process.env.npm_package_version,
    },
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 6000000,
      },
    }),
    electron([
      {
        entry: "electron/main.ts",
        onstart: (options) => {
          // Start Electron App
          if (process.env["VITE_DEV_ELECTRON_STARTUP"]) {
            options.startup([".", "--no-sandbox"]); // options.startup()
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
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".mustache",
      ".ts",
      ".tsx",
      ".vue",
    ],
  },
  server: {
    port: 54286,
  },
});
