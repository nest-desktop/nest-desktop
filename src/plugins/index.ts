/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import type { App } from "vue";
import { Vuetify3Dialog } from "vuetify3-dialog";

import router from "@/router";
import { registerWorkspaces } from "@/workspaces";
import pinia from "@/stores";

// Plugins
import codeMirror, { basicSetup } from "./codemirror";
import configs from "./configs";
import { baklavajs } from "./baklava";
import { loadFonts } from "./webfontloader";
import { vuetify } from "./vuetify";

export function registerPlugins(app: App) {
  // Load fonts
  loadFonts();

  // Use configs
  app.use(configs);

  // Use pinia store
  app.use(pinia);

  app.use(baklavajs);

  // Register workspaces
  registerWorkspaces(app);

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
  app.use(codeMirror, {
    extensions: [basicSetup],
  });
}
