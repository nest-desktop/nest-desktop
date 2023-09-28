// norseSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useNorseSimulatorStore = defineBackendStore(
  "norse",
  "norse",
  "http://localhost:11428"
);
