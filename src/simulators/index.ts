/**
 * simulators/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { App } from "vue";

import nest from "./nest";
import norse from "./norse";
import pynn from "./pynn";

const simulators = [nest, norse, pynn];

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
  // Use simulators
  simulators.forEach((simulator) => app.use(simulator));
}
