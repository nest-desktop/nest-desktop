// projectStore.ts

import { defineProjectStore } from "@/stores/project/defineProjectStore";

import { NorseProject } from "../../helpers/project/project";
import { useNorseProjectDBStore } from "./projectDBStore";

export const useNorseProjectStore = defineProjectStore({
  simulator: "norse",
  Project: NorseProject,
  useProjectDBStore: useNorseProjectDBStore,
});
