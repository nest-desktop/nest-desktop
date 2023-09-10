// modelStore.ts

import { defineStore } from "pinia";
import { useModelDBStore } from "./modelDBStore";

export const useModelStore = defineStore("model-view", {
  state: () => ({
    controllerOpen: false,
    controllerView: "",
    modelId: "",
    view: "doc",
    width: 320,
  }),
  getters: {
    model: (state) => {
      const modelDBStore = useModelDBStore();
      return modelDBStore.getModel(state.modelId);
    },
  },
  actions: {
    toggle(item: any = null) {
      if (!this.controllerOpen || this.controllerView === item.id) {
        this.controllerOpen = !this.controllerOpen;
      }
      this.controllerView = this.controllerOpen ? item.id : "";
    },
    /**
     * Save current model to the database.
     */
    save(): void {
      const modelDBStore = useModelDBStore();
      modelDBStore.saveModel(this.model.id);
    },
  },
});
