// nestModelStore.ts

import { defineStore } from "pinia";

import { useNESTModelDBStore } from "./modelDBStore";

export const useNESTModelStore = defineStore("nest-model-view", {
  state: () => ({
    controllerOpen: false,
    controllerView: "",
    modelId: "",
    view: "doc",
    width: 320,
  }),
  getters: {
    model: (state) => {
      const nestModelDBStore = useNESTModelDBStore();
      return nestModelDBStore.getModel(state.modelId);
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
      const norseModelDBStore = useNESTModelDBStore();
      norseModelDBStore.saveModel(this.model.id);
    },
  },
});
