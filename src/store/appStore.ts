// appStore

import { defineStore } from "pinia";

export const useAppStore = defineStore("app-store", {
  state: () => ({
    darkMode: false,
    devMode: false,
    simulator: {
      id: "nest",
      title: "NEST",
      icon: "simulator:nest",
      color: "nest",
    },
    webGL: false,
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
