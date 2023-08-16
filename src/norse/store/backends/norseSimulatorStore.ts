// norseSimulatorStore.ts

import { Backend } from "@/helpers/backend";
import { defineStore } from "pinia";

export const useNorseSimulatorStore = defineStore("norse-simulator-backend", {
  state: () => ({
    backend: new Backend("NorseSimulator", {
      path: "/",
      port: 5000,
      versionPath: "/",
      protocol: "http:"
    }),
  }),

  actions: {},
});
