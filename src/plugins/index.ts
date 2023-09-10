/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */
import type { App } from "vue";

import pinia from "@/store";
import router from "@/router";

// Simulators
import { registerSimulators } from "@/simulators";

// Load fonts
import { loadFonts } from "./webfontloader";

// Plugins
import { vuetify } from "./vuetify";
import codeMirror from "./codemirror";

export function registerPlugins(app: App) {

  // Load fonts
  loadFonts();

  // Use pinia
  app.use(pinia);

  // Register simulators
  registerSimulators(app);

  // Use vuetify
  app.use(vuetify);

  // Use router
  app.use(router);

  // Use CodeMirror
  app.use(codeMirror);
}
