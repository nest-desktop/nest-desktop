// modelStore.ts

import { defineModelStore } from "@/stores/model/defineModelStore";

import { useNorseModelDBStore } from "./modelDBStore";

export const useNorseModelStore = defineModelStore({
  workspace: "norse",
  useModelDBStore: useNorseModelDBStore,
});
