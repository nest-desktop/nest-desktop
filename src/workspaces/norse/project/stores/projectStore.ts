// projectStore.ts

import { computed } from "vue";

import { defineProjectStore } from "@/project";

import { NorseProject } from "../project";
import { useNorseProjectDBStore } from "./projectDBStore";

export const useNorseProjectStore = defineProjectStore<NorseProject>({
  workspace: "norse",
  Project: NorseProject,
  useProjectDBStore: useNorseProjectDBStore,
});

export const currentProject = computed(() => {
  const projectStore = useNorseProjectStore();
  return projectStore.state.project;
});
