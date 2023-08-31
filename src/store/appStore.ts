// appStore

import { defineStore } from "pinia";

export const simulatorItems: { [key: string]: { [key: string]: string } } = {
  nest: { id: "nest", title: "NEST", icon: "simulator:nest", color: "nest" },
  norse: { id: "norse", title: "Norse", icon: "simulator:norse" },
};

//   { id: "nest", title: "NEST", icon: "simulator:nest", color: "nest" },
//   { id: "norse", title: "Norse", icon: "simulator:norse" },
//   { id: "pynn", title: "PyNN", icon: "simulator:pynn" },
//   // { id: "arbor", title: "Arbor", icon: "simulator:arbor" },
//   // { id: "norse", title: "Norse", icon: "simulator:norse" },
// ];

export const useAppStore = defineStore("app-store", {
  state: () => ({
    darkMode: false,
    devMode: false,
    simulator: "nest",
    webGL: false,
  }),
  getters: {
    currentSimulator: (state) => simulatorItems[state.simulator],
  },
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
