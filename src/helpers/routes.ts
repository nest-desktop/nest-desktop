// routes.ts

import { RouteLocationNormalizedLoadedGeneric, Router } from "vue-router";
import { errorDialog } from "vuetify3-dialog";

import { useAppStore } from "@/stores/appStore";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { useNavStore } from "@/stores/navStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { useProjectViewStore } from "@/stores/project/projectViewStore";
import { TModel, TProject } from "@/types";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { confirmDialog } from "./common/confirmDialog";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "route",
});

/**
 * Before enter home path.
 */
export const homeBeforeEnter = (): void => {
  logger.trace("before enter home route");

  const navStore = useNavStore();
  navStore.state.open = false;
};

/**
 * Load a model.
 * @param modelId string
 */
const loadModel = (modelId: string): void => {
  logger.trace("load model:", modelId);

  const appStore = useAppStore();
  const modelStore: TModelStore = appStore.currentSimulator.stores.modelStore;
  const modelDBStore: TModelDBStore =
    appStore.currentSimulator.stores.modelDBStore;

  if (modelDBStore.state.initialized) {
    modelStore.state.modelId = modelId;
  } else {
    setTimeout(() => loadModel(modelId), 250);
  }
};

/**
 * Load a project.
 * @param projectId string
 */
const loadProject = (projectId?: string): void => {
  logger.trace("load project:", truncate(projectId));

  const appStore = useAppStore();
  const projectStore: TProjectStore =
    appStore.currentSimulator.stores.projectStore;
  const projectDBStore: TProjectStore =
    appStore.currentSimulator.stores.projectDBStore;

  if (projectDBStore.state.initialized) {
    projectStore.loadProject(projectId);
  } else {
    setTimeout(() => loadProject(projectId), 250);
  }
};

/**
 * Before enter model route.
 * @param to {path: string}
 */
export const modelBeforeEnter = (to: {
  params: { modelId: string };
  path: string;
}): void => {
  logger.trace("before enter:", to.path);

  const appStore = useAppStore();
  const modelStore: TModelStore = appStore.currentSimulator.stores.modelStore;

  let modelId: string = "";
  if (to.params.modelId) {
    modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  modelStore.state.views.main = path[path.length - 1] || "edit";

  loadModel(modelId);
};

/**
 * Redirect to model route.
 * @param to router object
 * @returns {path: string}
 */
export const modelRedirect = (to: {
  params: { modelId: string };
  path: string;
}): { path: string } => {
  logger.trace("redirect to model:", to.params.modelId);

  const appStore = useAppStore();
  const modelStore: TModelStore = appStore.currentSimulator.stores.modelStore;

  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  return modelStore.routeTo();
};

/**
 * Mount model layout
 * @param props
 */
export const mountModelLayout = (props: {
  router: Router;
  route: RouteLocationNormalizedLoadedGeneric;
}): void => {
  logger.trace("mount model layout");

  const appStore = useAppStore();
  const modelDBStore: TModelStore =
    appStore.currentSimulator.stores.modelDBStore;

  const modelIds = modelDBStore.state.models.map((model: TModel) => model.id);
  if (!modelIds.includes(props.route.params.modelId)) {
    errorDialog({
      text: `Model "${props.route.params.modelId}" not found.`,
    });
  }
};

/**
 * Mount project layout
 * @param props
 */
export const mountProjectLayout = (props: {
  router: Router;
  route: RouteLocationNormalizedLoadedGeneric;
}): void => {
  const projectId = props.route.params.projectId as string;
  logger.trace("mount project layout:", truncate(projectId));

  const appStore = useAppStore();
  const projectDBStore: TProjectStore =
    appStore.currentSimulator.stores.projectDBStore;

  const projectIds = projectDBStore.state.projects.map(
    (project: TProject) => project.id
  );

  const projectStore: TProjectStore =
    appStore.currentSimulator.stores.projectStore;
  if (projectStore.state.projectId === projectId) return;

  if (!projectIds.includes(projectId)) {
    confirmDialog({
      text: "Do you want to create a new project?",
      title: `Project (ID: ${truncate(projectId)}) not found.`,
    }).then((answer: boolean) => {
      if (answer) newProjectRoute(props.router);
    });
  }
};

export const newProjectRoute = (router: Router) => {
  logger.trace("new project route");

  const appStore = useAppStore();

  router.push({
    name: appStore.state.simulator + "ProjectNew",
  });
};

/**
 * Before enter project route.
 * @param to {path: string}
 */
export const projectBeforeEnter = (to: {
  params: { projectId: string };
  path: string;
}): void => {
  logger.trace("before enter project route:", to.path);

  const projectViewStore = useProjectViewStore();
  const path = to.path.split("/");
  projectViewStore.state.views.main = path[path.length - 1] || "edit";

  loadProject(to.params.projectId);
};

/**
 * Create a new project.
 * @returns {path: string}
 */
export const projectNew = (): { path: string } => {
  logger.trace("create a new project");

  const appStore = useAppStore();
  const projectStore: TProjectStore =
    appStore.currentSimulator.stores.projectStore;
  projectStore.newProject();

  return projectStore.routeTo();
};

/**
 * Redirect to project route.
 * @param to router object
 * @returns {path: string}
 */
export const projectRedirect = (to: {
  params: { projectId: string };
  path: string;
}): { path: string } => {
  logger.trace("redirect to project:", truncate(to.params.projectId));

  const appStore = useAppStore();
  const projectStore: TProjectStore =
    appStore.currentSimulator.stores.projectStore;

  if (to.params.projectId) loadProject(to.params.projectId);

  return projectStore.routeTo();
};
