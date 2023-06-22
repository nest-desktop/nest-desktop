// appStore

import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    darkMode: false,
    devMode: false,
    simulator: {
      id: "nest",
      title: "NEST",
      icon: "stimulator:nestIcon",
      color: "nest",
    },
  }),
  actions: {
    toggleTheme() {
      this.darkMode = !this.darkMode;

      // this.updateConfig({ darkMode: value });
      // this._project.view.update();
      // this._model.view.update();
      window.dispatchEvent(new Event("darkmode"));
    },
  },
});
