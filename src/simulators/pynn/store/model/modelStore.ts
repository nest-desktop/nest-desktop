// modelStore.ts

import { defineStore } from "pinia";
import { usePyNNModelDBStore } from "./modelDBStore";

export const usePyNNModelStore = defineStore("pynn-model-view", {
  state: () => ({
    controllerOpen: false,
    controllerView: "",
    modelId: "",
    view: "edit",
    width: 320,
  }),
  getters: {
    model: (state) => {
      const pynnModelDBStore = usePyNNModelDBStore();
      return pynnModelDBStore.getModel(state.modelId);
    },
  },
  actions: {
    toggle(item: any = null): void {
      if (!this.controllerOpen || this.controllerView === item.id) {
        this.controllerOpen = !this.controllerOpen;
      }
      this.controllerView = this.controllerOpen ? item.id : "";
    },
    /**
     * Save current model to the database.
     */
    save(): void {
      const pynnModelDBStore = usePyNNModelDBStore();
      pynnModelDBStore.saveModel(this.model.id);
    },
  },
});
