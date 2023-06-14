// modelStore.ts

import { Backend } from "@/helpers/backend";
import { defineStore } from "pinia";

export const useNESTSimulatorStore = defineStore("nest-simulator-backend", {
  state: () => ({
    backend: new Backend("NESTSimulator", {
      path: "/nest",
      port: 52425,
      versionPath: "/",
    }),
  }),

  actions: {},
});
