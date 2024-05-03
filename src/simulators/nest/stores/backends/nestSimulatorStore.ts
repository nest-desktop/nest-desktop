// nestSimulatorStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";

export const useNESTSimulatorStore = defineBackendStore(
  "nest",
  "nest",
  "http://localhost:52425"
);
