// projectRoutes.ts

import {
  projectBeforeEnter,
  projectNew,
  projectRedirect,
} from "@/helpers/routes";
import { TProjectStore } from "@/stores/project/defineProjectStore";

// import { useProjectViewStore } from "@/stores/project/projectViewStore";
import { useNESTProjectStore } from "../stores/project/projectStore";

const nestProjectBeforeEnter = (to: any) => {
  projectBeforeEnter(to);

  const projectStore: TProjectStore = useNESTProjectStore();
  if (projectStore.state.project) {
    if (!projectStore.state.project.network.nodes.hasSomeSpatialNodes) {
      projectStore.state.tab.activityView = "abstract";
    }
  }
};

const nestProjectRedirect = (to: any) => {
  projectRedirect(to);

  const projectStore: TProjectStore = useNESTProjectStore();
  if (!projectStore.state.project.network.nodes.hasSomeSpatialNodes) {
    projectStore.state.tab.activityView = "abstract";
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
