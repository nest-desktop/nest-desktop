// projectRoutes.ts

import { projectBeforeEnter, projectNew, projectRedirect } from "@/helpers/routes";
import { useAppStore } from "@/stores/appStore";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

// import { useProjectViewStore } from "@/stores/project/projectViewStore";
import { useNESTProjectStore } from "../stores/project/projectStore";
import { NESTNodes } from "../types";
import { TProjectRoute, TRoute } from "@/types";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest project route",
});

const nestProjectBeforeEnter = (to: TProjectRoute): void => {
  logger.trace("before enter nest project route:", to.path);
  projectBeforeEnter(to);

  const projectStore = useNESTProjectStore();
  if (projectStore.state.project) {
    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;

    if ("network" in projectStore.state.project) {
      const nodes: NESTNodes = projectStore.state.project.network.nodes as NESTNodes;
      if (!nodes.hasSomeSpatialNodes) projectViewStore.state.views.activity = "abstract";
    }
  }
};

const nestProjectRedirect = (to: TProjectRoute): TRoute => {
  logger.trace("redirect to nest project:", truncate(to.params.projectId));
  projectRedirect(to);

  const projectStore = useNESTProjectStore();
  if (projectStore.state.project) {
    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;

    const nodes: NESTNodes = projectStore.state.project?.network.nodes as NESTNodes;
    if (!nodes.hasSomeSpatialNodes) projectViewStore.state.views.activity = "abstract";
  }

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
