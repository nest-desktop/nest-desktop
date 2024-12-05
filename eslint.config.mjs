// eslint.config.mjs
// https://eslint.vuejs.org/user-guide/

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  {
    ignores: [
      ".gitignore",
      ".github",
      "**/coverage",
      "**/dev-dist",
      "**/dist",
      "**/dist-electron",
      "**/nest_desktop",
      "**/nest_desktop.egg-info",
      "**/node_modules",
      "**/release",
      "**/*.d.ts",
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      // your rules
      "vue/multi-word-component-names": "off",
    },
  },
  eslintConfigPrettier,
);
