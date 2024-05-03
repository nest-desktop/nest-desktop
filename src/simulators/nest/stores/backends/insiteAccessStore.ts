// insiteAccessStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";

export const useInsiteAccessStore = defineBackendStore(
  "nest",
  "insite",
  "http://localhost:52056"
);
