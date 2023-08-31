// norseModelStore.ts

import { defineStore } from "pinia";

export const useNorseModelStore = defineStore("norse-model-view", {
  state: () => ({
    controllerOpen: false,
    controllerView: "",
    modelId: "",
    view: "doc",
    width: 320,
  }),

  actions: {
    toggle(item: any=null) {
      if (!this.controllerOpen || this.controllerView === item.id) {
        this.controllerOpen = !this.controllerOpen;
      }
      this.controllerView = this.controllerOpen ? item.id : "";
    },
  },
});
