// projectRoutes.ts

import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { useNESTProjectDBStore } from "../stores/project/projectDBStore";
// import { useProjectViewStore } from "@/stores/project/projectViewStore";
import { useNESTProjectStore } from "../stores/project/projectStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest project route",
});

const loadProject = (projectId?: string) => {
  logger.trace("load project:", truncate(projectId));
  const projectStore: TProjectStore = useNESTProjectStore();
  const projectDBStore: TProjectDBStore = useNESTProjectDBStore();

  if (projectId) {
    if (projectDBStore.state.initialized) {
      projectStore.loadProject(projectId);
    } else {
      projectStore.state.projectId = projectId;
    }
  }
};

const projectBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);

  const projectStore: TProjectStore = useNESTProjectStore();
  loadProject(to.params.projectId);

  if (projectStore.state.project) {
    const path = to.path.split("/");
    projectStore.state.tab.view = path[path.length - 1] || "edit";
    if (!projectStore.state.project.network.nodes.hasSomeSpatialNodes) {
      projectStore.state.tab.activityView = "abstract";
    }
  }

  logger.trace("enter:", to.path);
};

const projectNew = () => {
  logger.trace("create a new nest project");

  const projectStore: TProjectStore = useNESTProjectStore();
  projectStore.loadProject();

  return {
    path:
      "/nest/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.tab.view,
  };
};

const projectRedirect = (to: any) => {
  logger.trace("redirect to project:", truncate(to.params.projectId));

  const projectStore: TProjectStore = useNESTProjectStore();
  loadProject(to.params.projectId);

  if (!projectStore.state.project.network.nodes.hasSomeSpatialNodes) {
    projectStore.state.tab.activityView = "abstract";
  }

  return {
    path:
      "/nest/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.tab.view,
  };
};

export default [
  {
    path: "",
    name: "nestProjectRoot",
    redirect: projectRedirect,
  },
  {
    path: "new",
    name: "nestProjectNew",
    redirect: projectNew,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "nestProject",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "nestNetworkEditor",
        components: {
          project: () => import("../views/ProjectNetworkEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "nestActivityExplorer",
        components: {
          project: () => import("../views/ProjectActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "nestLabBook",
        components: {
          project: () => import("../views/ProjectLabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
