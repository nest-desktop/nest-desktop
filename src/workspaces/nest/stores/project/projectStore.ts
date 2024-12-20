// projectStore.ts

import { defineProjectStore } from "@/stores/project/defineProjectStore";

import { NESTProject } from "../../helpers/project/project";
import { useNESTProjectDBStore } from "./projectDBStore";
import { NESTNetwork } from "../../types";

// export const useNESTProjectStore = defineProjectStore<NESTProject>({
export const useNESTProjectStore = defineProjectStore({
  workspace: "nest",
  Project: NESTProject,
  useProjectDBStore: useNESTProjectDBStore,
});

/**
 * Copy model.
 * @param modelId string
 */
export const copyModel = (modelId: string): void => {
  const projectStore = useNESTProjectStore();

  const network: NESTNetwork = projectStore.state.project?.network as NESTNetwork;
  network.modelsCopied.copy(modelId);
  network.changes();
};
