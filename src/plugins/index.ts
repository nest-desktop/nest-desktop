/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import type { App } from "vue";
import { Vuetify3Dialog } from "vuetify3-dialog";

import router from "@/router";
import { registerSimulators } from "@/simulators";
import pinia from "@/stores";

// Plugins
import codeMirror from "./codemirror";
import configs from "./configs";
import { vuetify } from "./vuetify";
import { loadFonts } from "./webfontloader";

export function registerPlugins(app: App) {
  // Load fonts
  loadFonts();

  // Use configs
  app.use(configs);

  // Use pinia store
  app.use(pinia);

  // Register simulators
  registerSimulators(app);

  // Use router
  app.use(router);

  // Use vuetify
  app.use(vuetify);

  // Use vuetify 3 dialog
  app.use(Vuetify3Dialog, {
    vuetify,
    defaults: {
      notify: {
        location: "top",
        timeout: 2000,
      },
    },
  });

  // Use codemirror
  app.use(codeMirror);
}
