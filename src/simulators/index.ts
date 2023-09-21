/**
 * simulators/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { App } from "vue";

import { useAppStore } from "@/store/appStore";

import nest from "./nest";
import norse from "./norse";
import pynn from "./pynn";

export const simulators: { [key: string]: any } = { nest, norse, pynn };
export const simulatorNames = Object.keys(simulators);

export const simulatorItems: {
  [key: string]: {
    color?: string;
    databases: string[];
    icon: string;
    id: string;
    routerName: string;
    title: string;
    backends: any;
  };
} = {};

export function registerSimulators(app: App) {
  const appStore = useAppStore();

  // Use simulators
  appStore.simulatorVisible.forEach((id) => app.use(simulators[id]));

  // const hostname = "https://nest-desktop-next.apps-dev.hbp.eu";
  // simulatorItems.nest.backends.nest.url = hostname + "/nest";
  // simulatorItems.norse.backends.norse.url = hostname + "/norse";
}
