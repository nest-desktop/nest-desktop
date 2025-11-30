// modelRoutes.ts

import type { RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router";

import { modelBeforeEnter, modelRedirect } from "@/model";
import { getCurrentViewStore, useAppStore } from "@/app";

import { useNESTModelStore } from "./stores";

const nestModelRedirect = (to: RouteLocationNormalizedGeneric): RouteLocationNormalizedLoadedGeneric => {
  modelRedirect(to);

  const appStore = useAppStore();
  const modelStore = useNESTModelStore();

  if (appStore.currentWorkspace) {
    const modelViewStore = getCurrentViewStore("model");

    if (modelStore.model && !modelStore.model.isNeuron) {
      if (modelViewStore.state.views.main === "explore") {
        modelViewStore.state.views.main = "doc";
      }
      if (modelViewStore.state.views.controller === "code") {
        modelViewStore.state.views.controller = "defaults";
      }
    }
  }

  return modelStore.routeTo();
};

export default [
  {
    path: "",
    name: "nestModelRoot",
    redirect: nestModelRedirect,
  },
  {
    path: ":modelId",
    redirect: nestModelRedirect,
    children: [
      {
        path: "",
        name: "nestModel",
        props: true,
        redirect: nestModelRedirect,
      },
      {
        path: "doc",
        name: "nestModelDoc",
        components: {
          model: () => import("./views/ModelDoc.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "nestModelExplorer",
        components: {
          model: () => import("@/model/views/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "edit",
        name: "nestModelEditor",
        components: {
          model: () => import("./views/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
