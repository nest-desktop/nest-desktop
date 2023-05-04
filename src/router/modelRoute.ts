/**
 * router/modelRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useModelStore } from "@/store/modelStore";

const beforeEnter = (to) => {
  const modelStore = useModelStore();

  modelStore.modelId = to.params.modelId || "dc_generator";

  const path = to.path.split("/");
  modelStore.view = path[path.length - 1] || "doc";
};

const redirect = (to) => {
  const modelStore = useModelStore();

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  return { path: "/model/" + modelStore.modelId + "/" + modelStore.view };
};

export default [
  {
    path: "model/",
    component: () => import("@/layouts/model/ModelLayout.vue"),
    children: [
      {
        path: "",
        name: "Model",
        component: () => import("@/views/model/ModelView.vue"),
        redirect,
      },
      {
        path: ":modelId/",
        children: [
          {
            path: "",
            name: "ModelId",
            props: true,
            redirect,
          },
          {
            path: "doc",
            name: "ModelDoc",
            components: {
              model: () => import("@/views/model/ModelDoc.vue"),
            },
            props: true,
            beforeEnter,
          },
          {
            path: "explore",
            name: "ModelExplorer",
            components: {
              model: () => import("@/views/model/ModelExplorer.vue"),
            },
            props: true,
            beforeEnter,
          },
          {
            path: "edit",
            name: "ModelEditor",
            components: {
              model: () => import("@/views/model/ModelEditor.vue"),
            },
            props: true,
            beforeEnter,
          },
        ],
      },
    ],
  },
];
