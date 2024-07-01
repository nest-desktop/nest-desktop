// projectRoutes.ts

import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { useNorseProjectDBStore } from "../stores/project/projectDBStore";
import { useNorseProjectStore } from "../stores/project/projectStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "norse project route",
});

const loadProject = (projectId?: string) => {
  logger.trace("load project:", truncate(projectId));
  const projectStore: TProjectStore = useNorseProjectStore();
  const projectDBStore: TProjectDBStore = useNorseProjectDBStore();

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

  const projectStore: TProjectStore = useNorseProjectStore();
  loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.state.tab.view = path[path.length - 1] || "edit";
};

const projectNew = () => {
  logger.trace("create a new norse project");

  const projectStore: TProjectStore = useNorseProjectStore();
  projectStore.loadProject();

  return {
    path:
      "/norse/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.tab.view,
  };
};

const projectRedirect = (to: any) => {
  logger.trace("redirect to project:", truncate(to.params.projectId));

  const projectStore: TProjectStore = useNorseProjectStore();
  loadProject(to.params.projectId);

  return {
    path:
      "/norse/project/" +
      projectStore.state.projectId +
      "/" +
      projectStore.state.tab.view,
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
