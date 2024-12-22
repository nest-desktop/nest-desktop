// projectStore.ts

import { computed } from "vue";

import { defineProjectStore } from "@/stores/project/defineProjectStore";

import { PyNNProject } from "../../helpers/project/project";
import { usePyNNProjectDBStore } from "./projectDBStore";

// export const usePyNNProjectStore = defineProjectStore<PyNNProject>({
export const usePyNNProjectStore = defineProjectStore({
  workspace: "pynn",
  Project: PyNNProject,
  useProjectDBStore: usePyNNProjectDBStore,
});

export const currentProject = computed(() => {
  const projectStore = usePyNNProjectStore();
  return projectStore.state.project as PyNNProject;
});
