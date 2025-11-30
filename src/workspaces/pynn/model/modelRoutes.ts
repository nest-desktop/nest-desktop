// modelRoute.ts

import { modelBeforeEnter, modelRedirect } from "@/model";

export default [
  {
    path: "",
    name: "pynnModelRoot",
    redirect: modelRedirect,
  },
  {
    path: ":modelId",
    redirect: modelRedirect,
    children: [
      {
        path: "",
        name: "pynnModel",
        props: true,
        redirect: modelRedirect,
      },
      {
        path: "edit",
        name: "pynnModelEditor",
        components: {
          model: () => import("@/model/views/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "pynnModelExplorer",
        components: {
          model: () => import("@/model/views/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
