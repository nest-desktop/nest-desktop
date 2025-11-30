/**
 * workspaces/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import type { App } from "vue";
import type { CompletionSource } from "@codemirror/autocomplete";
import type { IconSet } from "vuetify";
import type { RouteRecordRaw } from "vue-router";
import type { CodeGraph } from "@babsey/code-graph";

import router from "@/router";
import type { IProjectState } from "@/project";
import type { TStore } from "@/types";
import { Config } from "@/core";
import { addIconSet, addTheme } from "@/plugins/vuetify";
import { logger as mainLogger } from "@/utils";
import { useAppStore } from "@/app";

import { nest } from "./nest";
// import { norse } from "./norse";
// import { pynn } from "./pynn";

const logger = mainLogger.getSubLogger({ name: "workspace index" });

export interface IWorkspaceProps {
  backends: Record<string, TStore>;
  completionSources?: CompletionSource[];
  configNames: string[];
  databases: string[];
  iconSet: IconSet;
  id: string;
  init: () => void;
  loadGraphByProject?: (graph: CodeGraph, projectState: IProjectState) => void;
  route: RouteRecordRaw;
  stores: Record<string, TStore>;
  theme: Record<string, string>;
  title: string;
  views: Record<string, TStore>;
}

export const workspaces: Record<string, IWorkspaceProps> = {
  nest,
  // norse,
  // pynn,
  // elephant,
};

/**
 * Register workspaces.
 * @param app app instance
 */
export function registerWorkspaces(app: App) {
  Object.values(workspaces).forEach(registerWorkspace);

  // Initialize only visible workspaces.
  const appStore = useAppStore();
  appStore.state.workspacesEnabled.forEach((workspaceId: string) => initEnabledWorkspace(app, workspaceId));
}

/**
 * Register all workspaces
 * @remarks add iconSets, themes and routes
 * @param workspaceState workspace state
 */
function registerWorkspace(workspaceState: IWorkspaceProps): void {
  // Add icon set for vuetify.
  addIconSet(Object.fromEntries([[workspaceState.id, workspaceState.iconSet]]));

  // Add theme to vuetify.
  addTheme(workspaceState.theme);

  // Add route.
  router.addRoute("appLayout", workspaceState.route);
}

/**
 * Initialize enabled workspace.
 * @remarks add iconSets, themes and routes
 * @param app App instance
 * @param workspaceId workspace ID
 */
function initEnabledWorkspace(app: App, workspaceId: string): void {
  app.use({
    async install() {
      logger.trace("install", workspaceId);
      const workspaceState = workspaces[workspaceId];

      // Load config files.
      workspaceState.configNames.forEach((name: string) => new Config({ name, workspace: workspaceState.id }));

      // Initialize workspace.
      workspaceState.init();
    },
  });
}
