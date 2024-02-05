// projectDBStore.ts

import { defineProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { PyNNProject } from "../../helpers/project/project";
import { PyNNProjectDB } from "../../helpers/project/projectDB";
// import { usePyNNModelDBStore } from "../../stores/model/modelDBStore";
// import { usePyNNProjectStore } from "../../stores/project/projectStore";

const projectAssets = ["spike-activity", "spike-input", "current-input"];

export const usePyNNProjectDBStore = defineProjectDBStore({
  Project: PyNNProject,
  ProjectDB: PyNNProjectDB,
  projectAssets,
  simulator: "pynn",
});
