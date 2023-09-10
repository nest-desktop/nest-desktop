// appStore.ts

import { defineStore } from "pinia";
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
  persist: true,
});
