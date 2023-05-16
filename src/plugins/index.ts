/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Load fonts
import { loadFonts } from "./webfontloader";

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify).use(router).use(pinia)}
