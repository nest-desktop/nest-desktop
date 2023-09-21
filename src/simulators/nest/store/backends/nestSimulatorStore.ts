// nestSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useNESTSimulatorStore = defineBackendStore('nest', {
  defaults: {
    path: "nest",
    port: "52425",
    protocol: "",
    url:'http://localhost:52425',
  }
});