// nestSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useNESTSimulatorStore = defineBackendStore({
  defaults: {
    path: "nest",
    port: "52425",
    protocol: "",
  },
  enabled: true,
  name: "nest",
  url: "http://localhost:52425",
});