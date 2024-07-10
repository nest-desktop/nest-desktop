// defineModelStore.ts

import { Store, defineStore } from "pinia";
import { computed, reactive } from "vue";

import router from "@/router";
import { TModel, TProject } from "@/types";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { TModelDBStore } from "./defineModelDBStore";
import { useModelDBStore } from "./modelDBStore";

interface IModelStoreState {
  controller: {
    open: boolean;
    view: string;
    width: number;
  };
  modelId: string;
  models: string[];
  project?: TProject;
  projectFilename?: string;
  view: string;
}

export type TModelStore = Store<
  string,
  | {
      modelId: string;
      model: () => TModel;
      state: IModelStoreState;
      toggle: (item?: { id: string }) => void;
    }
  | any
>;

export function defineModelStore(
  props: {
    defaultView?: string;
    loggerMinLevel?: number;
    simulator: string;
    useModelDBStore: TModelDBStore;
  } = {
    simulator: "base",
    useModelDBStore,
  }
): TModelStore {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 3,
    name: props.simulator + " model store",
  });

  return defineStore(props.simulator + "-model-view", () => {
    const state = reactive<IModelStoreState>({
      controller: {
        open: false,
        view: "",
        width: 480,
      },
      modelId: "",
      models: [],
      view: props.defaultView || "edit",
    });

    const model = computed(() => {
      const modelDBStore: TModelStore = props.useModelDBStore();
      return modelDBStore.findModel(state.modelId) || findModel(state.modelId);
    });

    const findModel = (modelId: string) =>
      state.models.find((model: any) => model.id === modelId);

    /**
     * Initialize model store.
     */
    const init = (): void => {
      logger.trace("init");

      const modelDBStore: TModelDBStore = props.useModelDBStore();
      if (modelDBStore.state.models.length > 0) {
        state.modelId = modelDBStore.getRecentModelId();
      }
    };

    /**
     * Load model.
     * @param modelId string
     */
    const loadModel = (modelId: string = ""): void => {
      logger.trace("load model", truncate(modelId));

      const modelDBStore: TModelStore = props.useModelDBStore();
      const model = modelDBStore.getModel(modelId);
      state.modelId = model.id;
    };

    /**
     * New model.
     * @param modelId string
     */
    const newModel = (modelId: string): void => {
      logger.trace("new model");

      const modelDBStore: TModelStore = props.useModelDBStore();
      const model = modelDBStore.newModel({ id: modelId });
      state.modelId = model.id;
    };

    /**
     * Save current model to the database.
     */
    const saveModel = (): void => {
      logger.trace("save model");

      const modelDBStore: TModelDBStore = props.useModelDBStore();
      modelDBStore.saveModel(model.value);
    };

    /**
     * Start simulation of the current project.
     */
    const startSimulation = (): void => {
      logger.trace("start simulation:", truncate(state.project?.id));

      router
        .push({
          name: props.simulator + "ModelExplorer",
          params: { modelId: state.modelId },
        })
        .then(() => {
          // TODO: nextTick doesn't work.
          setTimeout(() => state.project?.startSimulation(), 100);
        });
    };

    /**
     * Toggle controller navigation.
     * @param item
     */
    const toggleController = (item?: { id: string }): void => {
      if (!state.controller.open || state.controller.view === item?.id) {
        state.controller.open = !state.controller.open;
      }
      state.controller.view = state.controller.open ? (item?.id as string) : "";
    };

    return {
      model,
      init,
      loadModel,
      newModel,
      saveModel,
      startSimulation,
      state,
      toggleController,
    };
  });
}
