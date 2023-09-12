// modelStore.ts

import { defineModelStore } from "@/store/model/defineModelStore";

import { useNorseModelDBStore } from "./modelDBStore";

export const useNorseModelStore = defineModelStore({
  simulator: "norse",
  useModelDBStore: useNorseModelDBStore,
});
