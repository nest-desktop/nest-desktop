/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Load fonts
import { loadFonts } from "./webfontloader";

// Plugins
import vuetify from "./vuetify";
import codeMirror from "./codemirror";

import pinia from "@/store";
import router from "@/router";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();

  // Use vuetify
  app.use(vuetify);

  // Use pinia
  app.use(pinia);

  // Use router
  app.use(router);

  // Use CodeMirror
  app.use(codeMirror);
}
