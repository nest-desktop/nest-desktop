// modelRoutes.ts

import { logger as mainLogger } from "@/helpers/common/logger";
import { TModelStore } from "@/stores/model/defineModelStore";

import { useNorseModelStore } from "../stores/model/modelStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "norse model route",
});

const modelBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);

  const modelStore: TModelStore = useNorseModelStore();
  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  modelStore.state.view = path[path.length - 1] || "edit";
};

const modelRedirect = (to: any) => {
  logger.trace("Redirect to model:", to.params.modelId);

  const modelStore: TModelStore = useNorseModelStore();

  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  return {
    path:
      "/norse/model/" + modelStore.state.modelId + "/" + modelStore.state.view,
  };
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
