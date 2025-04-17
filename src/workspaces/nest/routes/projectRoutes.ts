// projectRoutes.ts

import { TProjectRoute, TRoute } from "@/types";
import { projectBeforeEnter, projectNew, projectRedirect } from "@/helpers/routes";
import { useAppStore } from "@/stores/appStore";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

// import { useProjectViewStore } from "@/stores/project/projectViewStore";
import { currentProject, useNESTProjectStore } from "../stores/project/projectStore";

const logger = mainLogger.getSubLogger({ name: "nest project route" });

const nestProjectBeforeEnter = (to: TProjectRoute): void => {
  logger.trace("before enter nest project route:", to.path);
  projectBeforeEnter(to);

  if (!currentProject.value) return;

  const appStore = useAppStore();
  const projectViewStore = appStore.currentWorkspace.views.project;
  if (!currentProject.value.network.nodes.hasSomeSpatialNodes) projectViewStore.state.views.activity = "abstract";
};

const nestProjectRedirect = (to: TProjectRoute): TRoute => {
  logger.trace("redirect to nest project:", truncate(to.params.projectId));
  projectRedirect(to);

  if (currentProject) {
    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;
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
        name: "nestNetworkEditor",
        components: {
          project: () => import("../views/ProjectNetworkEditor.vue"),
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
