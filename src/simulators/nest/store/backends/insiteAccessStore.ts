// insiteAccessStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useInsiteAccessStore = defineBackendStore("insite", {
  defaults: {
    path: "insite",
    port: "52056",
    protocol: "",
    url: "http://localhost:52056",
  },
  disabled: true,
});