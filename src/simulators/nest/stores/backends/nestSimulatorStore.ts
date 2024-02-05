// nestSimulatorStore.ts

import { defineBackendStore } from "@/stores/backends/defineBackendStore";

export const useNESTSimulatorStore = defineBackendStore(
  "nest",
  "nest",
  "http://localhost:52425"
);
