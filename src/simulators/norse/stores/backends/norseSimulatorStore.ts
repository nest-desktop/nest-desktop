// norseSimulatorStore.ts

import { defineBackendStore } from "@/stores/backends/defineBackendStore";

export const useNorseSimulatorStore = defineBackendStore(
  "norse",
  "norse",
  "http://localhost:11428"
);
