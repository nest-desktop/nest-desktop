// norseModelStore.ts

import { defineStore } from "pinia";
import { useNorseModelDBStore } from "./norseModelDBStore";

export const useNorseModelStore = defineStore("norse-model-view", {
  state: () => ({
    controllerOpen: false,
    controllerView: "",
    modelId: "",
    view: "edit",
    width: 320,
  }),
  getters: {
    model: (state) => {
      const norseModelDBStore = useNorseModelDBStore();
      return norseModelDBStore.getModel(state.modelId);
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
      const norseModelDBStore = useNorseModelDBStore();
      norseModelDBStore.saveModel(this.model.id);
    },
  },
});
