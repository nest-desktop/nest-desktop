/**
 * simulators/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { App } from "vue";
import { IconSet } from "vuetify";
import { RouteRecordRaw } from "vue-router";
import { StateTree, Store } from "pinia";

import router from "@/router";
import { addTheme, addIconSet } from "@/plugins/vuetify";
import { Config } from "@/helpers/common/config";
import { useAppStore } from "@/stores/appStore";

import { nest } from "./nest";
import { norse } from "./norse";
import { pynn } from "./pynn";

export interface ISimulatorProps {
  autocomplete: any[];
  backends: { [key: string]: Store<string, StateTree> };
  configNames: string[];
  databases: string[];
  iconSet: IconSet;
  id: string;
  init: () => void;
  route: RouteRecordRaw;
  theme: { [key: string]: string };
  title: string;
}

export const simulators: { [key: string]: ISimulatorProps } = {
  nest,
  norse,
  pynn,
};

export function registerSimulators(app: App) {
  // Add IconSets, Themes and Routes of all simulators.
  Object.values(simulators).forEach((simulatorProps: ISimulatorProps) => {
    // Add icon set for vuetify.
    addIconSet(
      Object.fromEntries([[simulatorProps.id, simulatorProps.iconSet]])
    );

    // Add theme to vuetify.
    addTheme(simulatorProps.theme);

    // Add route.
    router.addRoute("appLayout", simulatorProps.route);
  });

  // Register only visible simulators.
  const appStore = useAppStore();
  appStore.state.simulatorVisible.forEach((id: string) => {
    app.use({
      async install() {
        const simulatorProps = simulators[id];

        // Load config files.
        simulatorProps.configNames.forEach(
          (name: string) => new Config({ name, simulator: simulatorProps.id })
        );

        // Initialize simulator.
        simulatorProps.init();
      },
    });
  });

  // const hostname = "https://nest-desktop-next.apps-dev.hbp.eu";
  // simulators.nest.backends.nest.url = hostname + "/nest";
  // simulators.norse.backends.norse.url = hostname + "/norse";
}
