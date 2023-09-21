// norseSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useNorseSimulatorStore = defineBackendStore("norse", {
  defaults: {
    path: "norse",
    port: "11428",
    protocol: "",
    url: "http://localhost:11428",
  },
});
