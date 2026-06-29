// projectDBStore.ts

import { defineProjectDBStore } from "@/project";

import { type INESTProjectState, NESTProject } from "../project";
import { NESTProjectDB } from "./projectDB";

const projectAssets = [
  "spatial-neurons",
  "spatial-spike-activity",
  "spike-activity",
  "spike-response",
  "step-current-response",
];

export const useNESTProjectDBStore = defineProjectDBStore<NESTProject, INESTProjectState>({
  // export const useNESTProjectDBStore = defineProjectDBStore({
  Project: NESTProject,
  ProjectDB: NESTProjectDB,
  projectAssets,
  workspace: "nest",
});
