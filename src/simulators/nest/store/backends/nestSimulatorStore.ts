// nestSimulatorStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

const urls = [
  'http://localhost:52425',
  'https://nest-desktop-next.apps-dev.hbp.eu/nest',
]

export const useNESTSimulatorStore = defineBackendStore('nest', {
  defaults: {
    path: "nest",
    port: "52425",
    protocol: "",
  },
  enabled: true,
  url: urls[1],
});