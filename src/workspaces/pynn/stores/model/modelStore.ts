// modelStore.ts

import { defineModelStore } from "@/stores/model/defineModelStore";

import { usePyNNModelDBStore } from "./modelDBStore";

export const usePyNNModelStore = defineModelStore({
  workspace: "pynn",
  useModelDBStore: usePyNNModelDBStore,
});
