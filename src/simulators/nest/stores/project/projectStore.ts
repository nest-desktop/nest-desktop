// projectStore.ts

import {
  TProjectStore,
  defineProjectStore,
} from "@/stores/project/defineProjectStore";

import { NESTProject } from "../../helpers/project/project";
import { useNESTProjectDBStore } from "./projectDBStore";

export const useNESTProjectStore = defineProjectStore({
  simulator: "nest",
  Project: NESTProject,
  useProjectDBStore: useNESTProjectDBStore,
});

/**
 * Copy model.
 * @param modelId string
 */
export const copyModel = (modelId: string): void => {
  const projectStore: TProjectStore = useNESTProjectStore();

  projectStore.state.project.network.modelsCopied.copy(modelId);
  projectStore.state.project.network.changes();
};
