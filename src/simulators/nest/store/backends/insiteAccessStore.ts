// insiteAccessStore.ts

import { defineBackendStore } from "@/store/backends/defineBackendStore";

export const useInsiteAccessStore = defineBackendStore(
  "nest",
  "insite",
  "http://localhost:52056"
);
