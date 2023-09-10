/**
 * simulators/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { App } from "vue";

import nest from "./nest";
import norse from "./norse";

export const simulatorItems: {
  [key: string]: {
    color?: string;
    databases: string[];
    icon: string;
    id: string;
    routerName: string;
    title: string;
  };
} = {};

export function registerSimulators(app: App) {
  // install nest
  app.use(nest);

  // install norse
  app.use(norse);
}
