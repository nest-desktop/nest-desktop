// routes.ts

import type { RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric, Router } from "vue-router";

import { useAppStore } from "@/app";
import type { TProject } from "@/types";
import { logger as mainLogger, truncate } from "@/utils";
import { confirmDialog } from "@/core";

const logger = mainLogger.getSubLogger({ name: "project route" });

/**
 * Load a project from the ID.
 * @param projectId projectID
 */
const loadProject = (projectId?: string): void => {
  logger.trace("load project:", truncate(projectId));

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return;

  const projectStore = appStore.currentWorkspace.stores.projectStore;
  const projectDBStore = appStore.currentWorkspace.stores.projectDBStore;

  if (projectDBStore.state.initialized) {
    projectStore.loadProject(projectId);
  } else {
    setTimeout(() => loadProject(projectId), 250);
  }
};

/**
 * Mount project layout.
 * @param props
 */
export const mountProjectLayout = (props: { router: Router; route: RouteLocationNormalizedLoadedGeneric }): void => {
  const projectId = props.route.params.projectId as string;
  logger.trace("mount project layout:", truncate(projectId));

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return;

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
  }, 1000);
};

/**
 * Route to create a new project.
 * @param router Router instance
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
 * @remarks It loads project.
 */
export const projectBeforeEnter = (to: RouteLocationNormalizedGeneric): void => {
  logger.trace("before enter project route:", to.path);

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return;

  const projectViewStore = appStore.currentWorkspace.views.project;
  const path = to.path.split("/");
  projectViewStore.state.views.main = path[path.length - 1] || "edit";

  if (to.query?.graphView) projectViewStore.state.views.graph = to.query.graphView;
  if (to.query?.activityView) projectViewStore.state.views.activity = to.query.activityView;

  loadProject(to.params.projectId as string);
};

/**
 * Create a new project.
 * @returns route
 */
export const projectNew = (): RouteLocationNormalizedLoadedGeneric => {
  logger.trace("create a new project");

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return { path: "/" } as RouteLocationNormalizedLoadedGeneric;

  const projectStore = appStore.currentWorkspace.stores.projectStore;
  projectStore.newProject();

  return projectStore.routeTo();
};

/**
 * Redirect to project route.
 * @param to project route
 * @returns route
 */
export const projectRedirect = (to: RouteLocationNormalizedGeneric): RouteLocationNormalizedLoadedGeneric => {
  logger.trace("redirect to project:", truncate(to.params.projectId as string));

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return { path: "/" } as RouteLocationNormalizedLoadedGeneric;

  const projectStore = appStore.currentWorkspace.stores.projectStore;

  if (to.params.projectId) loadProject(to.params.projectId as string);

  return projectStore.routeTo();
};
