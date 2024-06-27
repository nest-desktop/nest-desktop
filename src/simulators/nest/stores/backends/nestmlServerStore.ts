// nestmlServerStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";

export const useNESTMLServerStore = defineBackendStore(
  "nest",
  "nestml",
  "http://localhost:52426"
);
