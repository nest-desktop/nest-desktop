// pynnSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const usePyNNSimulatorStore = defineBackendStore("pynn", {
  defaults: {
    path: "pynn",
    port: "91198",
    protocol: "",
    url: "http://localhost:91198",
  }
});
