// norseSimulatorStore.ts

import { Backend } from "@/helpers/backend";
import { defineStore } from "pinia";

export const useNorseSimulatorStore = defineStore("norse-simulator-backend", {
  state: () => ({
    backend: new Backend("NorseSimulator", {
      path: "/norse",
      port: 11428,
      versionPath: "/",
      protocol: "http:"
    }),
  }),

  actions: {},
});
