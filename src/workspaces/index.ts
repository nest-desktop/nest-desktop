/**
 * workspaces/index.ts
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
  name: "workspace index",
});

export interface IWorkspaceProps {
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
  views: Record<string, TStore>;
}

export const workspaces: Record<string, IWorkspaceProps> = {
  nest,
  norse,
  // pynn,
  // elephant,
};

export function registerWorkspaces(app: App) {
  Object.values(workspaces).forEach(registerWorkspace);

  // Initialize only visible workspaces.
  const appStore = useAppStore();
  appStore.state.workspacesEnabled.forEach((workspaceId: string) => initEnabledWorkspace(app, workspaceId));
}

/**
 * Register all workspaces
 * @remarks add iconSets, themes and routes
 */
function registerWorkspace(workspaceProps: IWorkspaceProps): void {
  // Add icon set for vuetify.
  addIconSet(Object.fromEntries([[workspaceProps.id, workspaceProps.iconSet]]));

  // Add theme to vuetify.
  addTheme(workspaceProps.theme);

  // Add route.
  router.addRoute("appLayout", workspaceProps.route);
}

/**
 * Initialize enabled workspace.
 * @remarks add iconSets, themes and routes
 */
function initEnabledWorkspace(app: App, workspaceId: string): void {
  app.use({
    async install() {
      logger.trace("install", workspaceId);
      const workspaceProps = workspaces[workspaceId];

      // Load config files.
      workspaceProps.configNames.forEach((name: string) => new Config({ name, workspace: workspaceProps.id }));

      // Initialize workspace.
      workspaceProps.init();
    },
  });
}
