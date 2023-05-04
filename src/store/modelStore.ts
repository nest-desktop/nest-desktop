// Utilities
import { defineStore } from "pinia";

export const useModelStore = defineStore("model", {
  state: () => ({
    modelId: "dc_generator",
    view: "doc",
    controllerOpen: false,
    controllerView: "",
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
