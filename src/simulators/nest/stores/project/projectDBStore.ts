// projectDBStore.ts

import { defineProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { NESTProject } from "../../helpers/project/project";
import { NESTProjectDB } from "../../helpers/project/projectDB";

const projectAssets = [
  "spatial-neurons",
  "spatial-spike-activity",
  "spike-activity",
  "spike-input",
  "current-input",
];

export const useNESTProjectDBStore = defineProjectDBStore({
  Project: NESTProject,
  ProjectDB: NESTProjectDB,
  projectAssets,
  simulator: "nest",
});
