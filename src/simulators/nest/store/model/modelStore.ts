// modelStore.ts

import { defineModelStore } from "@/store/model/defineModelStore";

import { useNESTModelDBStore } from "./modelDBStore";

export const useNESTModelStore = defineModelStore({
  simulator: "nest",
  useModelDBStore: useNESTModelDBStore,
});
