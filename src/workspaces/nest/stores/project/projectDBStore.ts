// projectDBStore.ts

import { defineProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { INESTProjectProps, NESTProject } from "../../helpers/project/project";
import { NESTProjectDB } from "../../helpers/project/projectDB";

const projectAssets = [
  "spatial-neurons",
  "spatial-spike-activity",
  "spike-activity",
  "spike-response",
  "step-current-response",
];

export const useNESTProjectDBStore = defineProjectDBStore<NESTProject, INESTProjectProps>({
  // export const useNESTProjectDBStore = defineProjectDBStore({
  Project: NESTProject,
  ProjectDB: NESTProjectDB,
  projectAssets,
  workspace: "nest",
});
