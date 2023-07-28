/**
 * router/projectRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { logger as mainLogger } from "@/utils/logger";

import { useProjectDBStore } from "@nest/store/project/projectDBStore";
import { useProjectStore } from "@nest/store/project/projectStore";

const logger = mainLogger.getSubLogger({ name: "project route" });

const projectBeforeEnter = (to: any) => {
  logger.trace("Before enter project route:", to.path);

  const projectDBStore = useProjectDBStore();
  if (projectDBStore.projects.length === 0) {
    setTimeout(() => projectBeforeEnter(to), 100);
    return;
  }

  const projectStore = useProjectStore();
  projectStore.loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.view = path[path.length - 1] || "edit";
};

const projectRedirect = (to: any) => {
  logger.trace("Redirect project path:", to.params.projectId?.slice(0, 6));
  const projectStore = useProjectStore();

  if (to.params.projectId) {
    projectStore.loadProject(to.params.projectId);
  }

  return {
    path: "/nest/project/" + projectStore.projectId + "/" + projectStore.view,
  };
};

export default [
  {
    path: "",
    name: "Project",
    redirect: projectRedirect,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "ProjectId",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "NetworkGraphEditor",
        components: {
          project: () => import("../views/project/NetworkGraphEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "ActivityExplorer",
        components: {
          project: () => import("../views/project/ActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "LabBook",
        components: {
          project: () => import("../views/project/LabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
