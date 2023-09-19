/**
 * simulators/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { App } from "vue";

import nest from "./nest";
import norse from "./norse";
import pynn from "./pynn";

const simulatorVisible = ["nest", "norse"];
const simulators: { [key: string]: any } = { nest, norse, pynn };

export const simulatorItems: {
  [key: string]: {
    color?: string;
    databases: string[];
    icon: string;
    id: string;
    routerName: string;
    title: string;
    backends: any[];
  };
} = {};

export function registerSimulators(app: App) {
  // Use simulators
  simulatorVisible.forEach((id) => app.use(simulators[id]));
}
