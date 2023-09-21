// pynnSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const usePyNNSimulatorStore = defineBackendStore(
  "pynn",
  "pynn",
  "http://localhost:91198"
);
