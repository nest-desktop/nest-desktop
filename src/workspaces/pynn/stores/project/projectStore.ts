// projectStore.ts

import { defineProjectStore } from "@/stores/project/defineProjectStore";

import { PyNNProject } from "../../helpers/project/project";
import { usePyNNProjectDBStore } from "./projectDBStore";

// export const usePyNNProjectStore = defineProjectStore<PyNNProject>({
export const usePyNNProjectStore = defineProjectStore({
  workspace: "pynn",
  Project: PyNNProject,
  useProjectDBStore: usePyNNProjectDBStore,
});
