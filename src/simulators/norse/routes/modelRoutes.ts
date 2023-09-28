/**
 * modelRoutes.ts
 * */

import { logger as mainLogger } from "@/helpers/common/logger";

import { useNorseModelDBStore } from "../store/model/modelDBStore";
import { useNorseModelStore } from "../store/model/modelStore";

const logger = mainLogger.getSubLogger({
  name: "norse model route",
});

const modelBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);
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
  logger.trace("Redirect to model:", to.params.modelId);
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
