// projectRoutes.ts

import { projectBeforeEnter, projectNew, projectRedirect as baseProjectRedirect } from "@/helpers/routes";

import { useAppStore } from "@/stores/appStore";
import { TProjectRoute } from "@/types";

const projectRedirect = (to: TProjectRoute) => {
  const appStore = useAppStore();
  const projectViewStore = appStore.currentWorkspace.views.project;
  projectViewStore.state.views.controller = "code";
  return baseProjectRedirect(to);
};

export default [
  {
    path: "",
    name: "elephantProjectRoot",
    redirect: projectRedirect,
  },
  {
    path: "new",
    name: "elephantProjectNew",
    redirect: projectNew,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "elephantProject",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "elephantGraphEditor",
        components: {
          project: () => import("../views/ProjectGraphEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "elephantActivityExplorer",
        components: {
          project: () => import("../views/ProjectActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "elephantLabBook",
        components: {
          project: () => import("../views/ProjectLabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
