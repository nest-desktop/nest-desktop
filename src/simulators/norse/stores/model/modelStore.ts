// modelStore.ts

import { defineModelStore } from "@/stores/model/defineModelStore";

import { useNorseModelDBStore } from "./modelDBStore";

export const useNorseModelStore = defineModelStore({
  simulator: "norse",
  useModelDBStore: useNorseModelDBStore,
});
