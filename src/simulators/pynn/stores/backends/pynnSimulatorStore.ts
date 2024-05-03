// pynnSimulatorStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";

export const usePyNNSimulatorStore = defineBackendStore(
  "pynn",
  "pynn",
  "http://localhost:91198"
);
