// modelStore.ts

import { defineModelStore } from "@/stores/model/defineModelStore";

import { usePyNNModelDBStore } from "./modelDBStore";

export const usePyNNModelStore = defineModelStore({
  simulator: "pynn",
  useModelDBStore: usePyNNModelDBStore,
});
