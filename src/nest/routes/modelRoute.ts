/**
 * router/modelRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useModelDBStore } from "@nest/store/model/modelDBStore";
import { useModelStore } from "@nest/store/model/modelStore";

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

  return { path: "/nest/model/" + modelStore.modelId + "/" + modelStore.view };
};

export default [
  {
    path: "",
    name: "NESTModel",
    redirect: modelRedirect,
  },
  {
    path: ":modelId/",
    redirect: modelRedirect,
    children: [
      {
        path: "doc",
        name: "NESTModelDoc",
        components: {
          model: () => import("@nest/views/model/ModelDoc.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "NESTModelExplorer",
        components: {
          model: () => import("@nest/views/model/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "edit",
        name: "NESTModelEditor",
        components: {
          model: () => import("@nest/views/model/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "*",
        name: "NESTModelId",
        props: true,
        redirect: modelRedirect,
      },
    ],
  },
];
