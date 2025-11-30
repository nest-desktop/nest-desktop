// modelStore.ts

import { computed } from "vue";

import { defineModelStore } from "@/model";

import { NorseProject } from "../../project";
import { useNorseModelDBStore } from "./modelDBStore";

export const useNorseModelStore = defineModelStore<NorseProject>({
  Project: NorseProject,
  useModelDBStore: useNorseModelDBStore,
  workspace: "norse",
});

export const currentModel = computed(() => {
  const modelStore = useNorseModelStore();
  return modelStore.getModel(modelStore.state.modelId);
});
