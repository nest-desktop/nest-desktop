// appStore.ts

import { defineStore } from "pinia";
import { ThemeInstance } from "vuetify";

import { useAppSessionStore } from "./appSessionStore";
import { simulatorItems } from "@/simulators";

export const useAppStore = defineStore("app-store", {
  state: () => ({
    darkMode: false,
    simulator: "nest",
  }),
  getters: {
    currentSimulator: (state) => simulatorItems[state.simulator],
    session: () => {
      const appSessionStore = useAppSessionStore();
      return appSessionStore;
    },
  },
  actions: {
    toggleDarkMode(theme: ThemeInstance) {
      this.darkMode = !this.darkMode;
      this.setDarkMode(theme);
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
  },
  persist: true,
});
