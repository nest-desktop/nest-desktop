// nest/index.ts

import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";
import { logger as mainLogger } from "@/utils/logger";

import { ISimulatorProps } from "../";
import { nestCompletions } from "./codemirror/nestCompletion";
import { nestRandomCompletions } from "./codemirror/nestRandomCompletion";
import { nestSpatialCompletions } from "./codemirror/nestSpatialCompletion";
import { nestSpatialDistributionsCompletions } from "./codemirror/nestSpatialDistributionsCompletion";
import nestIconSet from "./components/iconSet";
import types from "./helpers/types";
import route from "./routes";
import { useInsiteAccessStore } from "./stores/backends/insiteAccessStore";
import { useNESTSimulatorStore } from "./stores/backends/nestSimulatorStore";
import { useNESTMLServerStore } from "./stores/backends/nestmlServerStore";
import { useNESTModelDBStore } from "./stores/model/modelDBStore";
import { useNESTProjectDBStore } from "./stores/project/projectDBStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest index",
});

export const nest: ISimulatorProps = {
  autocomplete: [
    nestCompletions,
    nestRandomCompletions,
    nestSpatialCompletions,
    nestSpatialDistributionsCompletions,
  ],
  backends: {},
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
    const modelDBStore: TModelDBStore = useNESTModelDBStore();
    const projectDBStore: TProjectDBStore = useNESTProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Initialize backend NEST Simulator.
    const nestSimulatorStore = useNESTSimulatorStore();
    nestSimulatorStore.init();

    // Initialize backend Insite Access.
    const insiteAccessStore = useInsiteAccessStore();
    insiteAccessStore.init();

    // Initialize backend NESTML Server.
    const nestmlServerStore = useNESTMLServerStore();
    nestmlServerStore.init();

    nest.backends = {
      nest: nestSimulatorStore,
      insite: insiteAccessStore,
      nestml: nestmlServerStore,
    };
  },
  route,
  title: "NEST",
  theme: {
    nest: "ff6633",
    "nest-model": "ff6633",
    "nest-project": "1281b3",
  },
  types,
};
