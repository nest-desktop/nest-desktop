// projectStore.ts

import { computed } from "vue";

import { defineProjectStore } from "@/stores/project/defineProjectStore";

import { NESTProject } from "../../helpers/project/project";
import { useNESTProjectDBStore } from "./projectDBStore";

// export const useNESTProjectStore = defineProjectStore<NESTProject>({
export const useNESTProjectStore = defineProjectStore({
  workspace: "nest",
  Project: NESTProject,
  useProjectDBStore: useNESTProjectDBStore,
});

/**
 * Copy model.
 * @param modelId string
 */
export const copyModel = (modelId: string): void => {
  const projectStore = useNESTProjectStore();
  if (!projectStore.state.project) return;
  const project = projectStore.state.project as NESTProject;
  project.network.copyModels.copy(modelId);
  project.network.changes();
};

export const currentProject = computed(() => {
  const projectStore = useNESTProjectStore();
  return projectStore.state.project as NESTProject;
});
