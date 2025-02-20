// projectDBStore.ts

import { defineProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { INorseProjectProps, NorseProject } from "../../helpers/project/project";
import { NorseProjectDB } from "../../helpers/project/projectDB";

const projectAssets = [
  "alternating-current-input",
  "noise-current-input",
  "spike-activity",
  "spike-inputs",
  "step-current-input",
];

export const useNorseProjectDBStore = defineProjectDBStore<NorseProject, INorseProjectProps>({
  // export const useNorseProjectDBStore = defineProjectDBStore({
  Project: NorseProject,
  ProjectDB: NorseProjectDB,
  projectAssets,
  workspace: "norse",
});
