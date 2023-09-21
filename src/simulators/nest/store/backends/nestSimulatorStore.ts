// nestSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useNESTSimulatorStore = defineBackendStore(
  "nest",
  "nest",
  "http://localhost:52425"
);
