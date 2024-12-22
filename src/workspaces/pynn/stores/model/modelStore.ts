// modelStore.ts

import { defineModelStore } from "@/stores/model/defineModelStore";

import { PyNNProject } from "../../helpers/project/project";
import { usePyNNModelDBStore } from "./modelDBStore";

export const usePyNNModelStore = defineModelStore<PyNNProject>({
  Project: PyNNProject,
  useModelDBStore: usePyNNModelDBStore,
  workspace: "pynn",
});
