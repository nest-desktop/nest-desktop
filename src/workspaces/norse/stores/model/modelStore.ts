// modelStore.ts

import { defineModelStore } from "@/stores/model/defineModelStore";

import { NorseProject } from "../../helpers/project/project";
import { useNorseModelDBStore } from "./modelDBStore";

export const useNorseModelStore = defineModelStore<NorseProject>({
  Project: NorseProject,
  useModelDBStore: useNorseModelDBStore,
  workspace: "norse",
});
