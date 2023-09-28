// projectStore.ts

import { defineProjectStore } from "@/store/project/defineProjectStore";

import { PyNNProject } from "../../helpers/project/project";
import { usePyNNProjectDBStore } from "./projectDBStore";

export const usePyNNProjectStore = defineProjectStore({
  simulator: "pynn",
  Project: PyNNProject,
  useProjectDBStore: usePyNNProjectDBStore,
});
