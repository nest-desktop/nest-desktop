/**
 * router/norseModelRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useNorseModelDBStore } from "../store/model/modelDBStore";
import { useNorseModelStore } from "../store/model/modelStore";

const modelBeforeEnter = (to: any) => {
  const modelStore = useNorseModelStore();

  const modelDBStore = useNorseModelDBStore();
  if (modelDBStore.models.length === 0) {
    setTimeout(() => modelBeforeEnter(to), 100);
    return;
  }

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  modelStore.view = path[path.length - 1] || "edit";
};

const modelRedirect = (to: any) => {
  const modelStore = useNorseModelStore();

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  return { path: "/norse/model/" + modelStore.modelId + "/" + modelStore.view };
};

export default [
  {
    path: "",
    name: "norseModelRoot",
    redirect: modelRedirect,
  },
  {
    path: ":modelId/",
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
          model: () => import("../views/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "norseModelExplorer",
        components: {
          model: () => import("../views/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
