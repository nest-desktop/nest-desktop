// insiteAccessStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useInsiteAccessStore = defineBackendStore('insite', {
  defaults: {
    path: "insite",
    port: "52056",
    protocol: "",
  },
  enabled: false,
  url: "http://localhost:52056",
});
