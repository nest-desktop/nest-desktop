// defineModelStore.ts

import { Store, defineStore } from "pinia";
import { computed, reactive } from "vue";

import { logger as mainLogger } from "@/helpers/common/logger";
import { TModel } from "@/types";

import { TModelDBStore } from "./defineModelDBStore";
import { useModelDBStore } from "./modelDBStore";

interface IModelStoreState {
  controller: {
    open: boolean;
    view: string;
  };
  modelId: string;
  models: string[];
  view: string;
  width: number;
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
  args: {
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
    minLevel: args.loggerMinLevel || 3,
    name: args.simulator + " model store",
  });

  return defineStore(args.simulator + "-model-view", () => {
    const state = reactive<IModelStoreState>({
      controller: {
        open: false,
        view: "",
      },
      modelId: "",
      models: [],
      view: args.defaultView || "edit",
      width: 320,
    });

    const model = computed(() => {
      const modelDBStore: TModelStore = args.useModelDBStore();
      return modelDBStore.getModel(state.modelId);
    });

    /**
     * Initialize model store.
     */
    const init = (): void => {
      logger.trace("init");

      const modelDBStore: TModelDBStore = args.useModelDBStore();
      if (modelDBStore.state.models.length > 0) {
        state.modelId = modelDBStore.getRecentModelId();
      }
    };

    /**
     * Save current model to the database.
     */
    const save = (): void => {
      logger.trace("save model");

      const modelDBStore: TModelDBStore = args.useModelDBStore();
      modelDBStore.saveModel(model.value.id);
    };

    /**
     * Toggle controller navigation.
     * @param item
     */
    const toggle = (item?: { id: string }): void => {
      if (!state.controller.open || state.controller.view === item?.id) {
        state.controller.open = !state.controller.open;
      }
      state.controller.view = state.controller.open ? (item?.id as string) : "";
    };

    return { model, init, save, state, toggle };
  });
}
