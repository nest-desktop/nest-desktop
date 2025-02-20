// projectStore.ts

import { computed } from "vue";

import { defineProjectStore } from "@/stores/project/defineProjectStore";

import { NorseProject } from "../../helpers/project/project";
import { useNorseProjectDBStore } from "./projectDBStore";

// export const useNorseProjectStore = defineProjectStore<NorseProject>({
export const useNorseProjectStore = defineProjectStore({
  workspace: "norse",
  Project: NorseProject,
  useProjectDBStore: useNorseProjectDBStore,
});

export const currentProject = computed(() => {
  const projectStore = useNorseProjectStore();
  return projectStore.state.project as NorseProject;
});
