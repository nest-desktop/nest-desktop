// projectStore.ts

import { defineProjectStore } from "@/stores/project/defineProjectStore";

import { NESTProject } from "../../helpers/project/project";
import { useNESTProjectDBStore } from "./projectDBStore";

export const useNESTProjectStore = defineProjectStore({
  simulator: "nest",
  Project: NESTProject,
  useProjectDBStore: useNESTProjectDBStore,
});
