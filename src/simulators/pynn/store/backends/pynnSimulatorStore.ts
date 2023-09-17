// pynnSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const usePyNNSimulatorStore = defineBackendStore({
  defaults: {
    path: "pynn",
    port: "91198",
    protocol: "",
  },
  enabled: false,
  name: "pynn",
  url: "http://localhost:91198",
});