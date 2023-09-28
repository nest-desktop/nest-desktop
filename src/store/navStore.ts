// Utilities
import { defineStore } from "pinia";

export const useNavStore = defineStore("nav", {
  state: () => ({
    resizing: false,
    open: false,
    width: 320,
    view: "project",
  }),

  actions: {
    toggle(navItem: any) {
      if (!this.open || this.view === navItem.id) {
        this.open = !this.open;
      }
      this.view = navItem.id;
    },
  },
});
