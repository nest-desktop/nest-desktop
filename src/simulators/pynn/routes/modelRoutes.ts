// modelRoute.ts

import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { logger as mainLogger } from "@/utils/logger";

import { usePyNNModelDBStore } from "../stores/model/modelDBStore";
import { usePyNNModelStore } from "../stores/model/modelStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "pynn model route",
});
const modelBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);

  let modelId: string;
  if (to.params.modelId) {
    modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  const view = path[path.length - 1] || "doc";

  const modelStore: TModelStore = usePyNNModelStore();
  const modelDBStore: TModelDBStore = usePyNNModelDBStore();

  let intervalId: string | number | NodeJS.Timeout;
  intervalId = setInterval(() => {
    if (!modelDBStore.state.initialized) return;

    modelStore.state.view = view;
    clearInterval(intervalId);

    modelStore.state.modelId = modelId;
  }, 250);
};

const modelRedirect = (to: any) => {
  logger.trace("Redirect to model:", to.params.modelId);

  const modelStore: TModelStore = usePyNNModelStore();

  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  return {
    path:
      "/pynn/model/" + modelStore.state.modelId + "/" + modelStore.state.view,
  };
};

export default [
  {
    path: "",
    name: "pynnModelRoot",
    redirect: modelRedirect,
  },
  {
    path: ":modelId/",
    redirect: modelRedirect,
    children: [
      {
        path: "",
        name: "pynnModel",
        props: true,
        redirect: modelRedirect,
      },
      {
        path: "edit",
        name: "pynnModelEditor",
        components: {
          model: () => import("../views/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "pynnModelExplorer",
        components: {
          model: () => import("../views/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
