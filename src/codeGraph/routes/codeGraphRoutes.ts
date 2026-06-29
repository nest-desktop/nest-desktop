// router/codeGraphRoutes.ts

import { initCodeGraph, useCodeGraphStore } from "@/codeGraph/stores/codeGraphStore";

export const defineCodeGraphRoute = (workspace: string) => [
  {
    path: "",
    name: workspace + "CodeGraphRoot",
    component: () => import("../layouts/CodeGraphLayout.vue"),
    redirect: () => {
      const codeGraphStore = useCodeGraphStore();
      const editorIds = Object.keys(codeGraphStore.state.editorStates);

      if (editorIds.length > 0 && editorIds.includes(codeGraphStore.state.currentEditorId)) {
        return { name: workspace + "CodeGraphEdit", params: { editorId: codeGraphStore.state.currentEditorId } };
      } else {
        return {
          name: workspace + "CodeGraphNew",
        };
      }
    },
  },
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
