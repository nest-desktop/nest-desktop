// nest/index.ts

import { defineViewStore } from "@/stores/defineViewStore";
import { logger as mainLogger } from "@/utils/logger";

import { IWorkspaceProps } from "../";
import {
  nestCompletions,
  nestRandomCompletions,
  nestSpatialCompletions,
  nestSpatialDistributionsCompletions,
} from "./codemirror";
import nestIconSet from "./components/iconSet";
import route from "./routes";
// import { insiteAccessInit } from "./stores/backends/insiteAccessStore";
import { nestSimulatorInit } from "./stores/backends/nestSimulatorStore";
import { nestmlServerInit } from "./stores/backends/nestmlServerStore";
import { useNESTModelDBStore } from "./stores/model/modelDBStore";
import { useNESTModelStore } from "./stores/model/modelStore";
import { useNESTProjectDBStore } from "./stores/project/projectDBStore";
import { useNESTProjectStore } from "./stores/project/projectStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest index",
});

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
      nest: nestSimulatorInit(),
      // insite: insiteAccessInit(),
      nestml: nestmlServerInit(),
    };

    nest.views = {
      project: defineViewStore({
        name: "project",
        workspace: "nest",
        views: {
          activity: "abstract",
          controller: "",
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
  route,
  stores: {},
  theme: {
    nest: "ff6633",
    "nest-model": "ff6633",
    "nest-project": "1281b3",
  },
  title: "NEST",
  views: {},
};
