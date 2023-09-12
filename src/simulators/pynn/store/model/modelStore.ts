// modelStore.ts

import { defineModelStore } from "@/store/model/defineModelStore";

import { usePyNNModelDBStore } from "./modelDBStore";

export const usePyNNModelStore = defineModelStore({
  simulator: "pynn",
  useModelDBStore: usePyNNModelDBStore,
});
