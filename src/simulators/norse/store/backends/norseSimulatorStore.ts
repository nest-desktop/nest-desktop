// norseSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

const urls = [
  "http://localhost:11428",
  "https://nest-desktop-next.apps-dev.hbp.eu/norse",
];

export const useNorseSimulatorStore = defineBackendStore("norse", {
  defaults: {
    path: "norse",
    port: "11428",
    protocol: "",
  },
  enabled: false,
  url: urls[0],
});
