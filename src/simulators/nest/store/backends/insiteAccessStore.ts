// insiteAccessStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useInsiteAccessStore = defineBackendStore({
  defaults: {
    path: "insite",
    port: "52056",
    protocol: "",
  },
  enabled: false,
  name: "insite",
  url: "http://localhost:52056",
});
