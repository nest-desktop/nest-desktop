// modelStore.ts

import { computed } from "vue";

import { defineModelStore } from "@/stores/model/defineModelStore";

import { NorseModel } from "../../types";
import { NorseProject } from "../../helpers/project/project";
import { useNorseModelDBStore } from "./modelDBStore";

export const useNorseModelStore = defineModelStore<NorseProject>({
  Project: NorseProject,
  useModelDBStore: useNorseModelDBStore,
  workspace: "norse",
});

export const currentModel = computed(() => {
  const modelStore = useNorseModelStore();
  return modelStore.getModel(modelStore.state.modelId) as NorseModel;
});

export const currentProject = computed(() => {
  const modelStore = useNorseModelStore();
  return modelStore.state.project as NorseProject;
});
