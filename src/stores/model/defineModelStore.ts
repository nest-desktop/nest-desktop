// defineModelStore.ts

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

  return defineStore(args.simulator + "-model-view", {
    state: () => ({
      controllerOpen: false,
      controllerView: "",
      modelId: "",
      view: args.defaultView || "edit",
      width: 320,
    }),
    getters: {
      model: (state) => {
        const modelDBStore = args.useModelDBStore();
        return modelDBStore.getModel(state.modelId);
      },
    },
    actions: {
      init(): void {
        logger.trace("init");
        const modelDBStore = args.useModelDBStore();
        if (modelDBStore.models.length > 0) {
          const model = modelDBStore.models[0];
          this.modelId = model.id;
        }
      },
      /**
       * Save current model to the database.
       */
      save(): void {
        logger.trace("save model");
        const modelDBStore = args.useModelDBStore();
        modelDBStore.saveModel(this.model.id);
      },
      toggle(item?: any) {
        if (!this.controllerOpen || this.controllerView === item.id) {
          this.controllerOpen = !this.controllerOpen;
        }
        this.controllerView = this.controllerOpen ? item.id : "";
      },
    },
  });
}
