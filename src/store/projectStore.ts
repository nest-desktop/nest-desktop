// Utilities
import { defineStore } from "pinia";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projectId: "xx",
    view: "edit",
    controllerOpen: false,
    controllerView: "",
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
