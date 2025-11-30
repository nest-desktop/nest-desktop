// modelRoutes.ts

import { modelBeforeEnter, modelRedirect } from "@/model";

export default [
  {
    path: "",
    name: "norseModelRoot",
    redirect: modelRedirect,
  },
  {
    path: ":modelId",
    redirect: modelRedirect,
    children: [
      {
        path: "",
        name: "norseModel",
        props: true,
        redirect: modelRedirect,
      },
      {
        path: "edit",
        name: "norseModelEditor",
        components: {
          model: () => import("@/model/views/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "norseModelExplorer",
        components: {
          model: () => import("@/model/views/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
