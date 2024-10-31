// eslint.config.mjs
import pluginVue from "eslint-plugin-vue";

export default [
  ...pluginVue.configs["flat/recommended"],
  {
    rules: {
      "vue/multi-word-component-names": "off",
      // "vue/valid-v-slot": [
      //   "error",
      //   {
      //     allowModifiers: true,
      //   },
      // ],
    },
    ignores: [
      ".gitignore",
      ".github/*",
      "coverage/*",
      "dev-dist/*",
      "dist-electron/*",
      "nest_desktop.egg-info/*",
      "node_modules/*",
      "release/*",
    ],
  },
];
