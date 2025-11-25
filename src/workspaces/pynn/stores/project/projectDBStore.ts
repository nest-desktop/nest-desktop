// projectDBStore.ts

import { defineProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { IPyNNProjectState, PyNNProject } from "../../helpers/project/project";
import { PyNNProjectDB } from "../../helpers/project/projectDB";
// import { usePyNNModelDBStore } from "../../stores/model/modelDBStore";
// import { usePyNNProjectStore } from "../../stores/project/projectStore";

const projectAssets = ["spike-activity", "spike-input", "current-input"];

export const usePyNNProjectDBStore = defineProjectDBStore<PyNNProject, IPyNNProjectState>({
  // export const usePyNNProjectDBStore = defineProjectDBStore({
  Project: PyNNProject,
  ProjectDB: PyNNProjectDB,
  projectAssets,
  workspace: "pynn",
});
