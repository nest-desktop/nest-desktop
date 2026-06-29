// projectDBStore.ts

import { defineProjectDBStore } from "@/project";

import { type INorseProjectState, NorseProject } from "../project";
import { NorseProjectDB } from "./projectDB";

const projectAssets = [
  "alternating-current-input",
  "noise-current-input",
  "spike-activity",
  "spike-inputs",
  "step-current-input",
];

export const useNorseProjectDBStore = defineProjectDBStore<NorseProject, INorseProjectState>({
  Project: NorseProject,
  ProjectDB: NorseProjectDB,
  projectAssets,
  workspace: "norse",
});
