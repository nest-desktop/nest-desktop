// projectDBStore.ts

import { defineProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { ElephantProject, IElephantProjectProps } from "../../helpers/project/project";
import { ElephantProjectDB } from "../../helpers/project/projectDB";
// import { useElephantModelDBStore } from "../../stores/model/modelDBStore";
// import { useElephantProjectStore } from "../../stores/project/projectStore";

const projectAssets: string[] = [];

export const useElephantProjectDBStore = defineProjectDBStore<ElephantProject, IElephantProjectProps>({
  // export const useElephantProjectDBStore = defineProjectDBStore({
  Project: ElephantProject,
  ProjectDB: ElephantProjectDB,
  projectAssets,
  workspace: "elephant",
});
