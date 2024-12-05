// vitest.config.ts
// https://vitest.dev/config/

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["**/nest_desktop/**", "**/node_modules/**", "**/dist/**", "**/dev-dist/**"],
    coverage: {
      provider: "v8", // 'istanbul' or 'v8'
      reporter: ["text", "json", "html"],
    },
  },
});
