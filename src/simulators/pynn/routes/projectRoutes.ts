// projectRoutes.ts

import { nextTick } from "vue";

import { logger as mainLogger } from "@/helpers/common/logger";

import { usePyNNProjectDBStore } from "../stores/project/projectDBStore";
import { usePyNNProjectStore } from "../stores/project/projectStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "pynn project route",
});

const projectBeforeEnter = (to: any) => {
  logger.trace("before enter project route:", to.path);

  const projectDBStore = usePyNNProjectDBStore();
  if (projectDBStore.state.projects.length === 0) {
    nextTick(() => projectBeforeEnter(to));
    return;
  }

  const projectStore = usePyNNProjectStore();
  projectStore.loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.state.view = path[path.length - 1] || "edit";
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
      projectStore.state.view,
  };
};

const projectRedirect = (to: any) => {
  logger.trace("redirect to project:", to.params.projectId?.slice(0, 6));
  const projectStore = usePyNNProjectStore();

  if (to.params.projectId) {
    projectStore.loadProject(to.params.projectId);
  }

  return {
    path:
      "/pynn/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.view,
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
