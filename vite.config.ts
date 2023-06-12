// Plugins
import vue from "@vitejs/plugin-vue";

import commonjs from "vite-plugin-commonjs";
import electron from "vite-plugin-electron";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    assetsInclude: ["**/*.code", "**/*.json"],
    assetsInlineLimit: 0,
    build: {
      outDir: "./dist", // "./nest_desktop/app"
    },
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true,
      }),
      commonjs(),
      electron([
        {
          entry: "electron/main.ts",
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
      __APP_ENV__: env.APP_ENV,
      "process.env": {
        APP_VERSION: process.env.npm_package_version,
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
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
  };
});
