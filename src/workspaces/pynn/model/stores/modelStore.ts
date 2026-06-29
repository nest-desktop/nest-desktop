// modelStore.ts

import { computed } from "vue";

import { defineModelStore } from "@/model";

import type { PyNNModel } from "../../types";
import { PyNNProject } from "../../project";
import { usePyNNModelDBStore } from "./modelDBStore";

export const usePyNNModelStore = defineModelStore<PyNNProject>({
  Project: PyNNProject,
  useModelDBStore: usePyNNModelDBStore,
  workspace: "pynn",
});

export const currentModel = computed(() => {
  const modelStore = usePyNNModelStore();
  return modelStore.getModel(modelStore.state.modelId) as PyNNModel;
});
