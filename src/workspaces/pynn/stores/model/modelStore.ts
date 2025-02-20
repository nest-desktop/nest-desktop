// modelStore.ts

import { computed } from "vue";

import { defineModelStore } from "@/stores/model/defineModelStore";

import { PyNNModel } from "../../types";
import { PyNNProject } from "../../helpers/project/project";
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

export const currentProject = computed(() => {
  const modelStore = usePyNNModelStore();
  return modelStore.state.project as PyNNProject;
});
