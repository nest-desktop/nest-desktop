// projectRoutes.ts

import type { RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router";

import { projectBeforeEnter, projectNew, projectRedirect } from "@/helpers/routes";
import { useAppStore } from "@/stores/appStore";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

// import { useProjectViewStore } from "@/stores/project/projectViewStore";
import { currentProject, useNESTProjectStore } from "../stores/project/projectStore";

const logger = mainLogger.getSubLogger({ name: "nest project route" });

const nestProjectBeforeEnter = (to: RouteLocationNormalizedGeneric): void => {
  logger.trace("before enter nest project route:", to.path);

  projectBeforeEnter(to);

  if (!currentProject.value) return;

  const appStore = useAppStore();
  const projectViewStore = appStore.currentWorkspace?.views.project;
  // if (!appStore.currentWorkspace) return;

  if (to.query?.graphView) projectViewStore.state.views.graph = to.query.graphView;
  if (to.query?.activityView) projectViewStore.state.views.activity = to.query.activityView;

  if (!currentProject.value.network.nodes.hasSomeSpatialNodes) projectViewStore.state.views.activity = "abstract";
};

const nestProjectRedirect = (to: RouteLocationNormalizedGeneric): RouteLocationNormalizedLoadedGeneric => {
  logger.trace("redirect to nest project:", truncate(to.params.projectId as string));
  projectRedirect(to);

  if (currentProject.value) {
    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;

    if (to.query?.graphView) projectViewStore.state.views.graph = to.query.graphView;

    if (!currentProject.value.network.nodes.hasSomeSpatialNodes) projectViewStore.state.views.activity = "abstract";
  }

  const projectStore = useNESTProjectStore();
  return projectStore.routeTo();
};

export default [
  {
    path: "",
    name: "nestProjectRoot",
    redirect: nestProjectRedirect,
  },
  {
    path: "new",
    name: "nestProjectNew",
    redirect: projectNew,
  },
  {
    path: ":projectId/",
    redirect: nestProjectRedirect,
    children: [
      {
        path: "",
        name: "nestProject",
        props: true,
        redirect: nestProjectRedirect,
      },
      {
        path: "edit",
        name: "nestGraphEditor",
        components: {
          project: () => import("../views/ProjectGraphEditor.vue"),
        },
        props: true,
        beforeEnter: nestProjectBeforeEnter,
      },
      {
        path: "explore",
        name: "nestActivityExplorer",
        components: {
          project: () => import("../views/ProjectActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: nestProjectBeforeEnter,
      },
      {
        path: "lab",
        name: "nestLabBook",
        components: {
          project: () => import("../views/ProjectLabBook.vue"),
        },
        props: true,
        beforeEnter: nestProjectBeforeEnter,
      },
    ],
  },
];
