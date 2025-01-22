// vite.config.mts
// https://vite.dev/config/

import { URL, fileURLToPath } from "node:url";
// Utilities
import { defineConfig } from "vite";
// Vite plugins
import ViteFonts from "unplugin-fonts/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import electron from "vite-plugin-electron";
import { VitePWA } from "vite-plugin-pwa";
// import vueDevTools from "vite-plugin-vue-devtools";

// Plugins
import Vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig((configEnv: { mode: string }) => ({
  build: {
    assetsInclude: ["**/*.nestml"],
    // chunkSizeWarningLimit: 1000, // https://github.com/vitejs/vite/discussions/9440
    outDir: "./nest_desktop/app",
    // https://stackoverflow.com/questions/71180561/vite-change-ouput-directory-of-assets
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: { name: string }) => {
          const name = assetInfo.name;
          let extType = name.split(".").at(1);
          if (/png|svg/.test(extType)) {
            extType = "img";
          } else if (/woff|woff2|eot|ttf|otf/.test(extType)) {
            extType = "fonts";
          }
          if (name.startsWith("vendors_")) {
            return `assets/${extType}/vendors/${name.slice(8)}-[hash][extname]`;
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: (assetInfo: { facadeModuleId: string; name: string }) => {
          // https://github.com/vitejs/vite-plugin-vue/issues/19
          const name = assetInfo.name;
          if (name.startsWith("vendors_")) {
            return `assets/js/vendors/${name.slice(8)}-[hash].js`;
          }
          return `assets/js/${name}-[hash].js`;
        },
        entryFileNames: "assets/js/[name]-[hash].js",
        manualChunks: (id: string): string => {
          // https://github.com/vitejs/vite/discussions/9440#discussioncomment-10131471
          const path = id.toString().split("/");
          if (path.includes("node_modules")) {
            const vendor = path[path.indexOf("node_modules") + 1];
            return "vendors_" + (vendor.startsWith("d3") ? "@d3" : vendor);
          }
          return "main";
        },
      },
    },
    // sourcemap: configEnv.mode === "development",
  },
  define: {
    global: "window",
    "process.env": {
      APP_VERSION: process.env.npm_package_version,
    },
  },
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    Vuetify({
      autoImport: true,
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
    VitePWA({
      devOptions: {
        enabled: true,
        type: "module",
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon-180x180.png",
        "maskable-icon-512x512.png",
        "pwa-64x64.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
      ],
      manifest: {
        name: "NEST Desktop",
        short_name: "NEST Desktop",
        description: "A web-based application which provides a graphical user interface for NEST Simulator",
        theme_color: "#ffffff",
        start_url: "/",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{eot,woff,tff,woff2,js,css,ico,png,svg}"],
        // maximumFileSizeToCacheInBytes: 2000000,
        // Don't fallback on document based (e.g. `/some-page`) requests
        // Even though this says `null` by default, I had to set this specifically to `null` to make it work
        navigateFallback: null,
      },
    }),
    // vueDevTools(),
    electron([
      {
        entry: "electron/main.ts",
        onstart(options) {
          // Start Electron App
          if (JSON.parse(process.env["VITE_DEV_ELECTRON_STARTUP"] || "false")) {
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
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".mustache", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 54286,
    warmup: {
      clientFiles: ["./src/views/*.vue", "./src/simulators/*/views/*.vue"],
    },
    watch: {
      ignored: ["**/coverage/**", "**/release/**"],
    },
  },
}));
