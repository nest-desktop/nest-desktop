// router/codeGraphRoutes.ts

import { initCodeGraph } from "@/codeGraph/stores/codeGraphStore";

export const defineCodeGraphRoute = (workspace: string) => [
  {
    path: "new",
    name: workspace + "CodeGraphNew",
    component: () => import("../layouts/CodeGraphLayout.vue"),
  },
  {
    path: "edit/:editorId",
    name: workspace + "CodeGraphEdit",
    component: () => import("../layouts/CodeGraphLayout.vue"),
    beforeEnter: initCodeGraph,
    props: true,
  },
];
