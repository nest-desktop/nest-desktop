// projectRoutes.ts

import { projectBeforeEnter, projectNew, projectRedirect } from "@/helpers/routes";

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
        name: "pynnGraphEditor",
        components: {
          project: () => import("../views/ProjectGraphEditor.vue"),
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
