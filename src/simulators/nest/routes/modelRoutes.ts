/**
 * modelRoutes.ts
 */

import { logger as mainLogger } from "@/helpers/common/logger";

import { useNESTModelDBStore } from "../stores/model/modelDBStore";
import { useNESTModelStore } from "../stores/model/modelStore";

const logger = mainLogger.getSubLogger({
  name: "nest model route",
});

const modelBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);
  const modelStore = useNESTModelStore();

  const modelDBStore = useNESTModelDBStore();
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
  logger.trace("Redirect to model:", to.params.modelId);
  const modelStore = useNESTModelStore();

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  return { path: "/nest/model/" + modelStore.modelId + "/" + modelStore.view };
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
