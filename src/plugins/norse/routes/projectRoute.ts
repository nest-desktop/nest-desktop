/**
 * router/projectRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { logger as mainLogger } from "@/utils/logger";

import { useNorseProjectDBStore } from "@norse/store/project/norseProjectDBStore";
import { useNorseProjectStore } from "@norse/store/project/norseProjectStore";

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

const projectRedirect = (to: any) => {
  logger.trace("Redirect project path:", to.params.projectId?.slice(0, 6));
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
    name: "NorseProject",
    redirect: projectRedirect,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "NorseProjectId",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "NorseNetworkGraphEditor",
        components: {
          project: () => import("@norse/views/project/NetworkGraphEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "NorseActivityExplorer",
        components: {
          project: () => import("@norse/views/project/ActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "NorseLabBook",
        components: {
          project: () => import("@norse/views/project/LabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
