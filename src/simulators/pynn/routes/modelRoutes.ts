// modelRoute.ts

import { nextTick } from "vue";

import { logger as mainLogger } from "@/helpers/common/logger";

import { usePyNNModelDBStore } from "../stores/model/modelDBStore";
import { usePyNNModelStore } from "../stores/model/modelStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "pynn model route",
});
const modelBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);
  const modelStore = usePyNNModelStore();

  const modelDBStore = usePyNNModelDBStore();
  if (modelDBStore.models.length === 0) {
    nextTick(() => modelBeforeEnter(to));
    return;
  }

  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  modelStore.state.view = path[path.length - 1] || "edit";
};

const modelRedirect = (to: any) => {
  logger.trace("Redirect to model:", to.params.modelId);
  const modelStore = usePyNNModelStore();

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
