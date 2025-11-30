// routes.ts

import type {
  RouteLocationGeneric,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric,
  Router,
} from "vue-router";
import { errorDialog } from "vuetify3-dialog";

import type { TModel } from "@/types";
import { logger as mainLogger } from "@/utils";
import { useAppStore } from "@/app";

const logger = mainLogger.getSubLogger({ name: "model route" });

/**
 * Load a model from the ID.
 * @param modelId model ID
 */
const loadModel = (modelId: string): void => {
  logger.trace("load model:", modelId);

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return;
  const modelStore = appStore.currentWorkspace.stores.modelStore;
  const modelDBStore = appStore.currentWorkspace.stores.modelDBStore;

  if (modelDBStore.state.initialized) {
    modelStore.state.modelId = modelId;
  } else {
    setTimeout(() => loadModel(modelId), 250);
  }
};

/**
 * Before enter model route.
 * @param to model route
 * @remarks It loads model.
 */
export const modelBeforeEnter = (to: RouteLocationNormalizedGeneric): void => {
  logger.trace("before enter:", to.path);

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return;

  const modelViewStore = appStore.currentWorkspace.views.model;

  let modelId: string = "";
  if (to.params.modelId) modelId = to.params.modelId as string;

  const path = to.path.split("/");
  modelViewStore.state.views.main = path[path.length - 1] || "edit";

  loadModel(modelId);
};

/**
 * Redirect to model route.
 * @param to model router
 * @returns router
 */
export const modelRedirect = (
  to: RouteLocationGeneric,
  // from: RouteLocationNormalizedGeneric,
): RouteLocationNormalizedLoadedGeneric => {
  logger.trace("redirect to model:", to.params.modelId);

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return { path: "/" } as RouteLocationNormalizedLoadedGeneric;

  const modelStore = appStore.currentWorkspace.stores.modelStore;
  if (to.params.modelId) modelStore.state.modelId = to.params.modelId;

  if (!modelStore.state.modelId && appStore.currentWorkspace.stores.modelDBStore.state.models.length > 0)
    modelStore.state.modelId = appStore.currentWorkspace.stores.modelDBStore.getRecentModelId();

  return modelStore.routeTo();
};

/**
 * Mount model layout.
 * @param props route props
 */
export const mountModelLayout = (props: { router: Router; route: RouteLocationNormalizedLoadedGeneric }): void => {
  const modelId = props.route.params.modelId;
  logger.trace("mount model layout");

  const appStore = useAppStore();
  if (!appStore.currentWorkspace) return;

  const modelDBStore = appStore.currentWorkspace.stores.modelDBStore;
  const modelStore = appStore.currentWorkspace.stores.modelStore;

  setTimeout(() => {
    if (modelStore.state.modelId === modelId) return;

    const modelIds = modelDBStore.state.models.map((model: TModel) => model.id);
    if (!modelIds.includes(modelId))
      errorDialog({
        text: `Model "${props.route.params.modelId}" not found.`,
      });
  }, 1000);
};
