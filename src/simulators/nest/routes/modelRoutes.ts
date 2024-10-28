// modelRoutes.ts

import { modelBeforeEnter, modelRedirect } from "@/helpers/routes";
import { useAppStore } from "@/stores/appStore";
import { TModelStore } from "@/stores/model/defineModelStore";

import { useNESTModelStore } from "../stores/model/modelStore";

const nestModelRedirect = (to: any) => {
  modelRedirect(to);

  const appStore = useAppStore();
  const modelStore: TModelStore = useNESTModelStore();
  const modelViewStore = appStore.currentSimulator.views.model;
  if (modelStore.model && !modelStore.model.isNeuron) {
    if (modelViewStore.state.views.main === "explore") {
      modelViewStore.state.views.main = "doc";
    }
    if (modelViewStore.state.views.controller === "code") {
      modelViewStore.state.views.controller = "defaults";
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
    path: ":modelId/",
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
          model: () => import("../views/ModelDoc.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "nestModelExplorer",
        components: {
          model: () => import("../views/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "edit",
        name: "nestModelEditor",
        components: {
          model: () => import("../views/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
