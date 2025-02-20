// routes.ts

import { RouteLocationNormalizedLoadedGeneric, Router } from "vue-router";
import { errorDialog } from "vuetify3-dialog";

import { useAppStore } from "@/stores/appStore";
import { useNavStore } from "@/stores/navStore";
import { TModel, TModelRoute, TProject, TProjectRoute } from "@/types";
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
  const modelStore = appStore.currentWorkspace.stores.modelStore;
  const modelDBStore = appStore.currentWorkspace.stores.modelDBStore;

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
  const projectStore = appStore.currentWorkspace.stores.projectStore;
  const projectDBStore = appStore.currentWorkspace.stores.projectDBStore;

  if (projectDBStore.state.initialized) {
    projectStore.loadProject(projectId);
  } else {
    setTimeout(() => loadProject(projectId), 250);
  }
};

/**
 * Before enter model route.
 * @param to model route
 */
export const modelBeforeEnter = (to: TModelRoute): void => {
  logger.trace("before enter:", to.path);

  const appStore = useAppStore();
  const modelViewStore = appStore.currentWorkspace.views.model;

  let modelId: string = "";
  if (to.params.modelId) modelId = to.params.modelId;

  const path = to.path.split("/");
  modelViewStore.state.views.main = path[path.length - 1] || "edit";

  loadModel(modelId);
};

/**
 * Redirect to model route.
 * @param to model router
 * @returns model router
 */
export const modelRedirect = (to: TModelRoute): TModelRoute => {
  logger.trace("redirect to model:", to.params.modelId);

  const appStore = useAppStore();
  const modelStore = appStore.currentWorkspace.stores.modelStore;

  if (to.params.modelId) modelStore.state.modelId = to.params.modelId;
  console.log(to);

  return modelStore.routeTo();
};

/**
 * Mount model layout.
 * @param props
 */
export const mountModelLayout = (props: { router: Router; route: RouteLocationNormalizedLoadedGeneric }): void => {
  const modelId = props.route.params.modelId as string;
  logger.trace("mount model layout");

  const appStore = useAppStore();
  const modelDBStore = appStore.currentWorkspace.stores.modelDBStore;
  const modelStore = appStore.currentWorkspace.stores.modelStore;

  setTimeout(() => {
    if (modelStore.state.modelId === modelId) return;

    const modelIds = modelDBStore.state.models.map((model: TModel) => model.id);
    if (!modelIds.includes(modelId))
      errorDialog({
        text: `Model "${props.route.params.modelId}" not found.`,
      });
  }, 250);
};

/**
 * Mount project layout.
 * @param props
 */
export const mountProjectLayout = (props: { router: Router; route: RouteLocationNormalizedLoadedGeneric }): void => {
  const projectId = props.route.params.projectId as string;
  logger.trace("mount project layout:", truncate(projectId));

  const appStore = useAppStore();
  const projectDBStore = appStore.currentWorkspace.stores.projectDBStore;
  const projectStore = appStore.currentWorkspace.stores.projectStore;

  setTimeout(() => {
    if (projectStore.state.projectId === projectId) return;

    const projectIds = projectDBStore.state.projects.map((project: TProject) => project.id);
    if (!projectIds.includes(projectId)) {
      confirmDialog({
        text: "Do you want to create a new project?",
        title: `Project (ID: ${truncate(projectId)}) not found.`,
      }).then((answer: boolean) => {
        if (answer) newProjectRoute(props.router);
      });
    }
  }, 250);
};

/**
 * Route to create a new project.
 * @param router Router object
 */
export const newProjectRoute = (router: Router) => {
  logger.trace("new project route");

  const appStore = useAppStore();

  router.push({
    name: appStore.state.currentWorkspace + "ProjectNew",
  });
};

/**
 * Before enter project route.
 * @param to project route
 */
export const projectBeforeEnter = (to: TProjectRoute): void => {
  logger.trace("before enter project route:", to.path);

  const appStore = useAppStore();
  const projectViewStore = appStore.currentWorkspace.views.project;
  const path = to.path.split("/");
  projectViewStore.state.views.main = path[path.length - 1] || "edit";

  loadProject(to.params.projectId);
};

/**
 * Create a new project.
 * @returns project route
 */
export const projectNew = (): TProjectRoute => {
  logger.trace("create a new project");

  const appStore = useAppStore();
  const projectStore = appStore.currentWorkspace.stores.projectStore;
  projectStore.newProject();

  return projectStore.routeTo();
};

/**
 * Redirect to project route.
 * @param to project route
 * @returns project route
 */
export const projectRedirect = (to: TProjectRoute): TProjectRoute => {
  logger.trace("redirect to project:", truncate(to.params.projectId));
  logger.trace("redirect to project:", to);

  const appStore = useAppStore();
  const projectStore = appStore.currentWorkspace.stores.projectStore;

  if (to.params.projectId) loadProject(to.params.projectId);

  return projectStore.routeTo();
};
