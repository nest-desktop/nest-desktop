// insiteAccessStore.ts

import { defineBackendStore } from "@/stores/backends/defineBackendStore";

export const useInsiteAccessStore = defineBackendStore(
  "nest",
  "insite",
  "http://localhost:52056"
);
