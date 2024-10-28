// projectRoutes.ts

import {
  projectBeforeEnter,
  projectNew,
  projectRedirect,
} from "@/helpers/routes";
import { useAppStore } from "@/stores/appStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

// import { useProjectViewStore } from "@/stores/project/projectViewStore";
import { useNESTProjectStore } from "../stores/project/projectStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest project route",
});

const nestProjectBeforeEnter = (to: any) => {
  logger.trace("before enter nest project route:", to.path);
  projectBeforeEnter(to);

  const appStore = useAppStore();
  const projectStore: TProjectStore = useNESTProjectStore();
  const projectViewStore = appStore.currentSimulator.views.project;
  if (projectStore.state.project) {
    if (!projectStore.state.project.network.nodes.hasSomeSpatialNodes) {
      projectViewStore.state.views.activity = "abstract";
    }
  }
};

const nestProjectRedirect = (to: any) => {
  logger.trace("redirect to nest project:", truncate(to.params.projectId));
  projectRedirect(to);

  const appStore = useAppStore();
  const projectStore: TProjectStore = useNESTProjectStore();
  const projectViewStore = appStore.currentSimulator.views.project;
  if (!projectStore.state.project.network.nodes.hasSomeSpatialNodes) {
    projectViewStore.state.views.activity = "abstract";
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
