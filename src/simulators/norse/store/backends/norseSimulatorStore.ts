// norseSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useNorseSimulatorStore = defineBackendStore({
  defaults: {
    path: "norse",
    port: "11428",
    protocol: "",
  },
  enabled: false,
  name: "norse",
  url: "http://localhost:11428",
});
