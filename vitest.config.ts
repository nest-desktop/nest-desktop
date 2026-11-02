// vitest.config.ts
// https://vitest.dev/config/

import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import Vuetify from "vite-plugin-vuetify";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // 'istanbul' or 'v8'
      reporter: ["text", "json", "html"],
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
          exclude: ["**/nest_desktop/**", "**/node_modules/**", "**/dist-electron/**", "**/dev-dist/**"],
        },
      },
      {
        plugins: [Vue(), Vuetify({ autoImport: true })],
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
          },
        },
        test: {
          name: "component",
          include: ["./tests/component/**/*.{test,spec}.ts"],
          environment: "jsdom",
          setupFiles: ["./tests/component/setup.ts"],
          // Vuetify imports its own CSS files, which have to go through Vite.
          server: { deps: { inline: ["vuetify"] } },
        },
      },
    ],
  },
});
