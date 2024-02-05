// modelStore.ts

import { defineModelStore } from "@/stores/model/defineModelStore";

import { useNESTModelDBStore } from "./modelDBStore";

export const useNESTModelStore = defineModelStore({
  simulator: "nest",
  useModelDBStore: useNESTModelDBStore,
  defaultView: "doc",
});
