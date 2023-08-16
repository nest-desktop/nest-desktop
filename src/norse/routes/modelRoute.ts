/**
 * router/modelRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useModelDBStore } from "@norse/store/model/modelDBStore";
import { useModelStore } from "@norse/store/model/modelStore";

const modelBeforeEnter = (to: any) => {
  const modelStore = useModelStore();

  const modelDBStore = useModelDBStore();
  if (modelDBStore.models.length === 0) {
    setTimeout(() => modelBeforeEnter(to), 100);
    return;
  }

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  modelStore.view = path[path.length - 1] || "doc";
};

const modelRedirect = (to: any) => {
  const modelStore = useModelStore();

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  return { path: "/norse/model/" + modelStore.modelId + "/" + modelStore.view };
};

export default [
  {
    path: "",
    name: "NorseModel",
    redirect: modelRedirect,
  },
  {
    path: ":modelId/",
    redirect: modelRedirect,
    children: [
      {
        path: "doc",
        name: "NorseModelDoc",
        components: {
          model: () => import("@norse/views/model/ModelDoc.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "NorseModelExplorer",
        components: {
          model: () => import("@norse/views/model/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "edit",
        name: "NorseModelEditor",
        components: {
          model: () => import("@norse/views/model/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "*",
        name: "NorseModelId",
        props: true,
        redirect: modelRedirect,
      },
    ],
  },
];
