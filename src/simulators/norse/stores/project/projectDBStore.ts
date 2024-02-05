// projectDBStore.ts

import { defineProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { NorseProject } from "../../helpers/project/project";
import { NorseProjectDB } from "../../helpers/project/projectDB";

const projectAssets = ["neuronal-states", "spike-activity"];

export const useNorseProjectDBStore = defineProjectDBStore({
  Project: NorseProject,
  ProjectDB: NorseProjectDB,
  projectAssets,
  simulator: "norse",
});
