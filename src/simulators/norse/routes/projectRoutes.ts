/**
 * projectRoutes.ts
 */

import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

import { useNorseProjectDBStore } from "../stores/project/projectDBStore";
import { useNorseProjectStore } from "../stores/project/projectStore";

const logger = mainLogger.getSubLogger({ name: "project route" });

const projectBeforeEnter = (to: any) => {
  logger.trace("before enter project route:", to.path);

  const projectDBStore = useNorseProjectDBStore();
  if (projectDBStore.projects.length === 0) {
    setTimeout(() => projectBeforeEnter(to), 100);
    return;
  }

  const projectStore = useNorseProjectStore();
  projectStore.loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.state.view = path[path.length - 1] || "edit";
};

const projectNew = () => {
  logger.trace("create a new norse project");
  const projectStore = useNorseProjectStore();
  projectStore.loadProject();

  return {
    path:
      "/norse/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.view,
  };
};

const projectRedirect = (to: any) => {
  logger.trace("redirect to project:", truncate(to.params.projectId || ""));
  const projectStore = useNorseProjectStore();

  if (to.params.projectId) {
    projectStore.loadProject(to.params.projectId);
  }

  return {
    path:
      "/norse/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.view,
  };
};

export default [
  {
    path: "",
    name: "norseProjectRoot",
    redirect: projectRedirect,
  },
  {
    path: "new",
    name: "norseProjectNew",
    redirect: projectNew,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "norseProject",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "norseNetworkEditor",
        components: {
          project: () => import("../views/ProjectNetworkEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "norseActivityExplorer",
        components: {
          project: () => import("../views/ProjectActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "norseLabBook",
        components: {
          project: () => import("../views/ProjectLabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
