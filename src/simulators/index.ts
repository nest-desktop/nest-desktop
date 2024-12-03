/**
 * simulators/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { App } from "vue";
import { RouteRecordRaw } from "vue-router";
import { IconSet } from "vuetify";

import { Config } from "@/helpers/common/config";
import { addIconSet, addTheme } from "@/plugins/vuetify";
import router from "@/router";
import { useAppStore } from "@/stores/appStore";
import { TStore } from "@/types";
import { logger as mainLogger } from "@/utils/logger";
import { CompletionSource } from "@codemirror/autocomplete";

import { nest } from "./nest";
import { norse } from "./norse";

// import { pynn } from "./pynn";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "simulator index",
});

export interface ISimulatorProps {
  backends: Record<string, TStore>;
  completionSources?: CompletionSource[];
  configNames: string[];
  databases: string[];
  iconSet: IconSet;
  id: string;
  init: () => void;
  route: RouteRecordRaw;
  stores: Record<string, TStore>;
  theme: Record<string, string>;
  title: string;
  types: Record<string, any>;
  views: Record<string, TStore>;
}

export const simulators: Record<string, ISimulatorProps> = {
  nest,
  norse,
  // pynn,
};

export function registerSimulators(app: App) {
  // Add IconSets, Themes and Routes of all simulators.
  Object.values(simulators).forEach((simulatorProps: ISimulatorProps) => {
    // Add icon set for vuetify.
    addIconSet(Object.fromEntries([[simulatorProps.id, simulatorProps.iconSet]]));

    // Add theme to vuetify.
    addTheme(simulatorProps.theme);

    // Add route.
    router.addRoute("appLayout", simulatorProps.route);
  });

  // Register only visible simulators.
  const appStore = useAppStore();
  appStore.state.simulatorVisible.forEach((simulatorId: string) => {
    app.use({
      async install() {
        logger.trace("install", simulatorId);
        const simulatorProps = simulators[simulatorId];

        // Load config files.
        simulatorProps.configNames.forEach((name: string) => new Config({ name, simulator: simulatorProps.id }));

        // Initialize simulator.
        simulatorProps.init();
      },
    });
  });
}
