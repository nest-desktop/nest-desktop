/**
 * router/modelRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useModelStore } from "@/store/modelStore";

const modelBeforeEnter = (to: any) => {
  const modelStore = useModelStore();

  modelStore.modelId = to.params.modelId || "dc_generator";

  const path = to.path.split("/");
  modelStore.view = path[path.length - 1] || "doc";
};

const modelRedirect = (to: any) => {
  const modelStore = useModelStore();

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  return { path: "/model/" + modelStore.modelId + "/" + modelStore.view };
};

export default [
  {
    path: "",
    name: "Model",
    component: () => import("@/views/model/ModelView.vue"),
    redirect: modelRedirect,
  },
  {
    path: ":modelId/",
    children: [
      {
        path: "",
        name: "ModelId",
        props: true,
        redirect: modelRedirect,
      },
      {
        path: "doc",
        name: "ModelDoc",
        components: {
          model: () => import("@/views/model/ModelDoc.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "ModelExplorer",
        components: {
          model: () => import("@/views/model/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "edit",
        name: "ModelEditor",
        components: {
          model: () => import("@/views/model/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
