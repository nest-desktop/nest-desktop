// modelStore.ts

import { computed } from "vue";

import { defineModelStore } from "@/stores/model/defineModelStore";

import { ElephantModel } from "../../helpers/model/model";
import { ElephantProject } from "../../helpers/project/project";
import { useElephantModelDBStore } from "./modelDBStore";

export const useElephantModelStore = defineModelStore<ElephantProject>({
  Project: ElephantProject,
  useModelDBStore: useElephantModelDBStore,
  workspace: "elephant",
});

export const currentModel = computed(() => {
  const modelStore = useElephantModelStore();
  return modelStore.getModel(modelStore.state.modelId) as ElephantModel;
});

export const currentProject = computed(() => {
  const modelStore = useElephantModelStore();
  return modelStore.state.project as ElephantProject;
});
