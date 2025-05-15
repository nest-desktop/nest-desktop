// projectStore.ts

import { computed } from "vue";

import { defineProjectStore } from "@/stores/project/defineProjectStore";

import { ElephantProject } from "../../helpers/project/project";
import { useElephantProjectDBStore } from "./projectDBStore";

export const useElephantProjectStore = defineProjectStore<ElephantProject>({
  Project: ElephantProject,
  useProjectDBStore: useElephantProjectDBStore,
  workspace: "elephant",
});

export const currentProject = computed(() => {
  const projectStore = useElephantProjectStore();
  return projectStore.state.project as ElephantProject;
});
