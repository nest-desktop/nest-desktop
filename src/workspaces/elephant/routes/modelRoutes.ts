// modelRoute.ts

import { modelBeforeEnter, modelRedirect } from "@/helpers/routes";

export default [
  {
    path: "",
    name: "elephantModelRoot",
    redirect: modelRedirect,
  },
  {
    path: ":modelId/",
    redirect: modelRedirect,
    children: [
      {
        path: "",
        name: "elephantModel",
        props: true,
        redirect: modelRedirect,
      },
      {
        path: "edit",
        name: "elephantModelEditor",
        components: {
          model: () => import("../views/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "elephantModelExplorer",
        components: {
          model: () => import("../views/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
