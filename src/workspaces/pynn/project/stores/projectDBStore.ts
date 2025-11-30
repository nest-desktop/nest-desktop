// projectDBStore.ts

import { defineProjectDBStore } from "@/project";

import { IPyNNProjectState, PyNNProject } from "../project";
import { PyNNProjectDB } from "./projectDB";

const projectAssets = ["spike-activity", "spike-input", "current-input"];

export const usePyNNProjectDBStore = defineProjectDBStore<PyNNProject, IPyNNProjectState>({
  // export const usePyNNProjectDBStore = defineProjectDBStore({
  Project: PyNNProject,
  ProjectDB: PyNNProjectDB,
  projectAssets,
  workspace: "pynn",
});
