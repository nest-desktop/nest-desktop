/**
 * router/projectRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { logger as mainLogger } from "@/helpers/logger";

import { useNESTProjectDBStore } from "@nest/store/project/nestProjectDBStore";
import { useNESTProjectStore } from "@nest/store/project/nestProjectStore";

const logger = mainLogger.getSubLogger({ name: "project route" });

const projectBeforeEnter = (to: any) => {
  logger.trace("Before enter project route:", to.path);

  const projectDBStore = useNESTProjectDBStore();
  if (projectDBStore.projects.length === 0) {
    setTimeout(() => projectBeforeEnter(to), 100);
    return;
  }

  const projectStore = useNESTProjectStore();
  projectStore.loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.view = path[path.length - 1] || "edit";
};

const projectNew = () => {
  logger.trace("Create a new nest project");
  const projectStore = useNESTProjectStore();
  projectStore.loadProject();

  return {
    path: "/nest/project/" + projectStore.projectId + "/" + projectStore.view,
  };
};

const projectRedirect = (to: any) => {
  logger.trace("Redirect to project:", to.params.projectId?.slice(0, 6));
  const projectStore = useNESTProjectStore();

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
    name: "NESTProject",
    redirect: projectRedirect,
  },
  {
    path: "new",
    name: "NESTProjectNew",
    redirect: projectNew,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "NESTProjectId",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "NESTNetworkGraphEditor",
        components: {
          project: () => import("@nest/views/project/NetworkGraphEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "NESTActivityExplorer",
        components: {
          project: () => import("@nest/views/project/ActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "NESTLabBook",
        components: {
          project: () => import("@nest/views/project/LabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
