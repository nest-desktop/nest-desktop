// projectRoutes.ts

import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

import { usePyNNProjectDBStore } from "../stores/project/projectDBStore";
import { usePyNNProjectStore } from "../stores/project/projectStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "pynn project route",
});

const loadProject = (projectId?: string) => {
  logger.trace("load project:", truncate(projectId || ""));
  const projectStore = usePyNNProjectStore();
  const projectDBStore = usePyNNProjectDBStore();

  if (projectId) {
    if (projectDBStore.state.initialized) {
      projectStore.loadProject(projectId);
    } else {
      projectStore.state.projectId = projectId;
    }
  }
};

const projectBeforeEnter = (to: any) => {
  logger.trace("before enter project route:", to.path);

  const projectStore = usePyNNProjectStore();
  loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.state.tab.view = path[path.length - 1] || "edit";
};

const projectNew = () => {
  logger.trace("create a new pynn project");

  const projectStore = usePyNNProjectStore();
  projectStore.loadProject();

  return {
    path:
      "/pynn/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.tab.view,
  };
};

const projectRedirect = (to: any) => {
  logger.trace("redirect to project:", truncate(to.params.projectId || ""));

  const projectStore = usePyNNProjectStore();
  loadProject(to.params.projectId);

  return {
    path:
      "/pynn/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.tab.view,
  };
};

export default [
  {
    path: "",
    name: "pynnProjectRoot",
    redirect: projectRedirect,
  },
  {
    path: "new",
    name: "pynnProjectNew",
    redirect: projectNew,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "pynnProject",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "pynnNetworkEditor",
        components: {
          project: () => import("../views/ProjectNetworkEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "pynnActivityExplorer",
        components: {
          project: () => import("../views/ProjectActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "pynnLabBook",
        components: {
          project: () => import("../views/ProjectLabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
