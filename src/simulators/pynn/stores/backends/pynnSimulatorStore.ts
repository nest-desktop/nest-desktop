// pynnSimulatorStore.ts

import { defineBackendStore } from "@/stores/backends/defineBackendStore";

export const usePyNNSimulatorStore = defineBackendStore(
  "pynn",
  "pynn",
  "http://localhost:91198"
);
