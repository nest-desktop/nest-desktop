// modelRoutes.ts

import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { logger as mainLogger } from "@/utils/logger";

import { useNESTModelDBStore } from "../stores/model/modelDBStore";
import { useNESTModelStore } from "../stores/model/modelStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest model route",
});

const modelBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);

  let modelId: string;
  if (to.params.modelId) {
    modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  const view = path[path.length - 1] || "doc";

  const modelStore: TModelStore = useNESTModelStore();
  const modelDBStore: TModelDBStore = useNESTModelDBStore();

  let intervalId: string | number | NodeJS.Timeout;

  intervalId = setInterval(() => {
    if (!modelDBStore.state.initialized) return;

    modelStore.state.view = view;
    clearInterval(intervalId);

    modelStore.state.modelId = modelId;
  }, 250);
};

const modelRedirect = (to: any) => {
  logger.trace("redirect to model:", to.params.modelId);

  const modelStore: TModelStore = useNESTModelStore();
  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  return {
    path:
      "/nest/model/" + modelStore.state.modelId + "/" + modelStore.state.view,
  };
};

export default [
  {
    path: "",
    name: "nestModelRoot",
    redirect: modelRedirect,
  },
  {
    path: ":modelId/",
    redirect: modelRedirect,
    children: [
      {
        path: "",
        name: "nestModel",
        props: true,
        redirect: modelRedirect,
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
