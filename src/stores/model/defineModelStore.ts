// defineModelStore.ts

import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import { logger as mainLogger } from "@/helpers/common/logger";
import { useModelDBStore } from "./modelDBStore";

export function defineModelStore(
  args: {
    defaultView?: string;
    loggerMinLevel?: number;
    simulator: string;
    useModelDBStore: any;
  } = {
    simulator: "base",
    useModelDBStore,
  }
) {
  const logger = mainLogger.getSubLogger({
    minLevel: args.loggerMinLevel || 3,
    name: args.simulator + " model store",
  });

  return defineStore(args.simulator + "-model-view", () => {
    const state = reactive({
      controllerOpen: false,
      controllerView: "",
      modelId: "",
      view: args.defaultView || "edit",
      width: 320,
    });

    const model = computed(() => {
      const modelDBStore = args.useModelDBStore();
      return modelDBStore.getModel(state.modelId);
    });

    /**
     * Initialize model store.
     */
    const init = (): void => {
      logger.trace("init");
      const modelDBStore = args.useModelDBStore();
      if (modelDBStore.models.length > 0) {
        const model = modelDBStore.models[0];
        state.modelId = model.id;
      }
    };

    /**
     * Save current model to the database.
     */
    const save = (): void => {
      logger.trace("save model");
      const modelDBStore = args.useModelDBStore();
      modelDBStore.saveModel(model.value.id);
    };

    /**
     * Toggle controller navigation.
     * @param item
     */
    const toggle = (item?: any): void => {
      if (!state.controllerOpen || state.controllerView === item.id) {
        state.controllerOpen = !state.controllerOpen;
      }
      state.controllerView = state.controllerOpen ? item.id : "";
    };

    return { model, init, save, state, toggle };
  });
}
