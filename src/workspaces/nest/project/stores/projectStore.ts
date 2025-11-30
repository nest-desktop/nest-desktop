// projectStore.ts

import { computed } from "vue";

import { defineProjectStore } from "@/project";

import { NESTProject } from "../project";
import { useNESTProjectDBStore } from "./projectDBStore";

export const useNESTProjectStore = defineProjectStore<NESTProject>({
  workspace: "nest",
  Project: NESTProject,
  useProjectDBStore: useNESTProjectDBStore,
});

/**
 * Copy model.
 * @param modelId string
 */
export const doCopyModel = (modelId: string): void => {
  const projectStore = useNESTProjectStore();
  if (!projectStore.state.project) return;
  const project = projectStore.state.project;
  project.network.copyModels.copy(modelId);
  project.network.changes();
};

export const currentProject = computed(() => {
  const projectStore = useNESTProjectStore();
  return projectStore.state.project;
});
