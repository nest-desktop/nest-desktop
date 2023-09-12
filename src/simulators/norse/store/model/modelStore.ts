// modelStore.ts

import { defineModelStore } from "@/store/model/defineModelStore";

import { useNorseModelDBStore } from "./modelDBStore";

export const useNorseModelStore = defineModelStore({
  defaultView: "edit",
  simulator: "norse",
  useModelDBStore: useNorseModelDBStore,
});
