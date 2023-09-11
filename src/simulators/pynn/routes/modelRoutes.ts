/**
 * modelRoute.ts
 */

import { logger as mainLogger } from "@/helpers/common/logger";

import { usePyNNModelDBStore } from "../store/model/modelDBStore";
import { usePyNNModelStore } from "../store/model/modelStore";

const logger = mainLogger.getSubLogger({
  name: "pynn model route",
});
const modelBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);
  const modelStore = usePyNNModelStore();

  const modelDBStore = usePyNNModelDBStore();
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
  logger.trace("Redirect to model:", to.params.modelId);
  const modelStore = usePyNNModelStore();

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  return { path: "/pynn/model/" + modelStore.modelId + "/" + modelStore.view };
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
