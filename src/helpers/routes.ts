// routes.ts

import { useAppStore } from "@/stores/appStore";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { useNavStore } from "@/stores/navStore";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "route",
});

export const homeBeforeEnter = () => {
  logger.trace("before enter home route");

  const navStore = useNavStore();
  navStore.state.open = false;
};

/**
 * before enter to model route.
 * @param to {path: string}
 */
export const modelBeforeEnter = (to: {
  params: { modelId: string };
  path: string;
}) => {
  logger.trace("before enter:", to.path);
  const appStore = useAppStore();
  const modelStore: TModelStore = appStore.currentSimulator.stores.modelStore;
  const modelDBStore: TModelDBStore =
    appStore.currentSimulator.stores.modelDBStore;

  let modelId: string;
  if (to.params.modelId) {
    modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  modelStore.state.view = path[path.length - 1] || "edit";

  let intervalId: string | number | NodeJS.Timeout;
  intervalId = setInterval(() => {
    if (!modelDBStore.state.initialized) return;
    clearInterval(intervalId);
    modelStore.state.modelId = modelId;
  }, 250);
};

/**
 * redirect to model route.
 * @param to router object
 * @returns {path: string}
 */
export const modelRedirect = (to: {
  params: { modelId: string };
  path: string;
}) => {
  logger.trace("redirect to model:", to.params.modelId);

  const appStore = useAppStore();
  const modelStore: TModelStore = appStore.currentSimulator.stores.modelStore;

  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  return modelStore.routeTo();
};

/**
 * Load a project.
 * @param projectId string
 */
export const loadProject = (projectId?: string) => {
  logger.trace("load project:", truncate(projectId));

  const appStore = useAppStore();
  const projectStore: TModelStore =
    appStore.currentSimulator.stores.projectStore;
  const projectDBStore: TModelStore =
    appStore.currentSimulator.stores.projectDBStore;

  if (projectId) {
    if (projectDBStore.state.initialized) {
      projectStore.loadProject(projectId);
    } else {
      projectStore.state.projectId = projectId;
    }
  }
};

/**
 * before enter to project route.
 * @param to {path: string}
 */
export const projectBeforeEnter = (to: {
  params: { projectId: string };
  path: string;
}) => {
  logger.trace("before enter project route:", to.path);

  const appStore = useAppStore();
  const projectStore: TModelStore =
    appStore.currentSimulator.stores.projectStore;

  loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.state.tab.view = path[path.length - 1] || "edit";
};

/**
 * create a new project.
 * @returns {path: string}
 */
export const projectNew = () => {
  logger.trace("create a new project");

  const appStore = useAppStore();
  const projectStore: TModelStore =
    appStore.currentSimulator.stores.projectStore;
  projectStore.newProject();

  return projectStore.routeTo();
};

/**
 * redirect to project route.
 * @param to router object
 * @returns {path: string}
 */
export const projectRedirect = (to: {
  params: { projectId: string };
  path: string;
}) => {
  logger.trace("redirect to project:", truncate(to.params.projectId));

  const appStore = useAppStore();
  const projectStore: TModelStore =
    appStore.currentSimulator.stores.projectStore;
  loadProject(to.params.projectId);

  return projectStore.routeTo();
};
