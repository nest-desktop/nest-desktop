// nest/install.ts

import type { IWorkspaceProps } from "@/workspaces/install";
import { defineViewStore } from "@/nav";
import { logger as mainLogger } from "@/utils";

import {
  nestCompletions,
  nestRandomCompletions,
  nestSpatialCompletions,
  nestSpatialDistributionsCompletions,
} from "./codemirror";

import nestIconSet from "./components/iconsets";
import route from "./routes";
import { loadGraphByNESTProject } from "./migration";
// import { initInsiteAccess } from "./insite/backends";
import { initNESTSimulator } from "./backends";
import { initNESTMLServer } from "./nestml/backends";
import { useNESTModelDBStore, useNESTModelStore } from "./model/stores";
import { useNESTProjectDBStore, useNESTProjectStore } from "./project/stores";
import { registerNodeTypeModule } from "@/codeGraph";

import { registerNESTNodeTypes } from "./codeNodeTypes/nest";

const logger = mainLogger.getSubLogger({ name: "nest index" });

export const nest: IWorkspaceProps = {
  backends: {},
  completionSources: [
    nestCompletions,
    nestRandomCompletions,
    nestSpatialCompletions,
    nestSpatialDistributionsCompletions,
  ],
  configNames: [
    "NESTConnection",
    "NESTConnectionMask",
    "NESTModel",
    "NESTNodeSlice",
    "NESTNodeSpatial",
    "NESTSimulationKernel",
  ],
  databases: ["NEST_MODEL_STORE", "NEST_PROJECT_STORE"],
  iconSet: nestIconSet,
  id: "nest",
  init: () => {
    logger.trace("init");

    // Initialize stores.
    const modelDBStore = useNESTModelDBStore();
    const projectDBStore = useNESTProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    const modelStore = useNESTModelStore();
    if (modelStore.state.recentAddedModels.recorder.length === 0) {
      modelStore.state.recentAddedModels.recorder = ["multimeter", "spike_recorder", "voltmeter"];
    }
    const projectStore = useNESTProjectStore();

    nest.stores = {
      modelDBStore,
      modelStore,
      projectDBStore,
      projectStore,
    };

    nest.backends = {
      nest: initNESTSimulator(),
      // insite: initInsiteAccess(),
      nestml: initNESTMLServer(),
    };

    nest.views = {
      project: defineViewStore({
        name: "project",
        workspace: "nest",
        views: {
          activity: "abstract",
          controller: "",
          graph: "network",
          main: "edit",
        },
      })(),
      model: defineViewStore({
        name: "model",
        workspace: "nest",
        views: {
          controller: "",
          main: "doc",
        },
      })(),
    };
  },
  loadGraphByProject: loadGraphByNESTProject,
  route,
  stores: {},
  theme: {
    "nest": "ff6633",
    "nest-model": "ff6633",
    "nest-project": "1281b3",
  },
  title: "NEST",
  views: {},
};
