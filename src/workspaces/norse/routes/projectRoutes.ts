// projectRoutes.ts

import { projectBeforeEnter, projectNew, projectRedirect } from "@/helpers/routes";

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
        name: "norseGraphEditor",
        components: {
          project: () => import("../views/ProjectGraphEditor.vue"),
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
