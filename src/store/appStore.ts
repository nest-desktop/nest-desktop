// appStore.ts

import { defineStore } from "pinia";
import { ThemeInstance } from "vuetify";

import { useAppSessionStore } from "./appSessionStore";
import { simulatorItems } from "@/simulators";

export const useAppStore = defineStore("app-store", {
  state: () => ({
    autoUpdate: false,
    darkMode: false,
    simulator: "nest",
    simulatorVisible: ["nest", "norse"]
  }),
  getters: {
    hasSimulator: (state) => {
      const simulatorIds = Object.keys(simulatorItems);
      return simulatorIds.includes(state.simulator);
    },
    currentSimulator: (state) => simulatorItems[state.simulator],
    session: () => {
      const appSessionStore = useAppSessionStore();
      return appSessionStore;
    },
  },
  actions: {
    resetSimulator() {
      this.simulator = Object.keys(simulatorItems)[0];
    },
    setDarkMode(theme: ThemeInstance) {
      if (theme.global) {
        theme.global.name.value = this.darkMode ? "dark" : "light";
        // @ts-ignore
      } else if (theme.window) {
        // @ts-ignore
        theme.window.name.value = this.darkMode ? "dark" : "light";
      }
    },

    toggleDarkMode(theme: ThemeInstance) {
      this.darkMode = !this.darkMode;
      this.setDarkMode(theme);
    },
  },
  persist: true,
});
