/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: [
      "**/*.d.ts",
      "**/.venv/**",
      "**/.vscode/**",
      "**/coverage/**",
      "**/dev-dist/**",
      "**/dist-electron/**",
      "**/nest_desktop/**",
      "**/node_modules/**",
      "**/out/**",
      "**/upgrades/**",
      "**/vendors/**",
      "**/types.ts"
    ],
  },

  ...pluginVue.configs["flat/recommended"],
  ...vueTsEslintConfig(),

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"],
  },

  {
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      "vue/multi-word-component-names": "off",
    },
  },
  skipFormatting,
];
