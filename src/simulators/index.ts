/**
 * simulators/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Simulators
import nest from "@/simulators/nest";

import norse from "@/simulators/norse";

// Types
import type { App } from "vue";

export function registerSimulators(app: App) {
  // NEST Simulator
  app.use(nest);

  // Norse Simulator
  app.use(norse);
}
