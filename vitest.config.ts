import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // 'istanbul' or 'v8'
      reporter: ["text", "json", "html"],
    },
  },
});
