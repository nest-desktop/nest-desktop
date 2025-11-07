// router/codeGraphRoutes.ts

import { initCodeGraph } from "@/stores/graph/codeGraphStore";

export default [
  {
    path: "new/",
    name: "new",
    component: () => import("@/layouts/CodeGraphLayout.vue"),
  },
  {
    path: "edit/:editorId",
    name: "edit",
    component: () => import("@/layouts/CodeGraphLayout.vue"),
    beforeEnter: initCodeGraph,
    props: true,
  },
];
