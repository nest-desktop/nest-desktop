/**
 * router/norseProjectRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { logger as mainLogger } from "@/helpers/common/logger";

import { useNorseProjectDBStore } from "../store/project/norseProjectDBStore";
import { useNorseProjectStore } from "../store/project/norseProjectStore";

const logger = mainLogger.getSubLogger({ name: "project route" });

const projectBeforeEnter = (to: any) => {
  logger.trace("Before enter project route:", to.path);

  const projectDBStore = useNorseProjectDBStore();
  if (projectDBStore.projects.length === 0) {
    setTimeout(() => projectBeforeEnter(to), 100);
    return;
  }

  const projectStore = useNorseProjectStore();
  projectStore.loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.view = path[path.length - 1] || "edit";
};

const projectNew = () => {
  logger.trace("Create a new norse project");
  const projectStore = useNorseProjectStore();
  projectStore.loadProject();

  return {
    path: "/norse/project/" + projectStore.projectId + "/" + projectStore.view,
  };
};

const projectRedirect = (to: any) => {
  logger.trace("Redirect to project:", to.params.projectId?.slice(0, 6));
  const projectStore = useNorseProjectStore();

  if (to.params.projectId) {
    projectStore.loadProject(to.params.projectId);
  }

  return {
    path: "/norse/project/" + projectStore.projectId + "/" + projectStore.view,
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
          project: () => import("../views/NorseProjectNetworkEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "norseActivityExplorer",
        components: {
          project: () => import("../views/NorseProjectActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "norseLabBook",
        components: {
          project: () => import("../views/NorseProjectLabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
