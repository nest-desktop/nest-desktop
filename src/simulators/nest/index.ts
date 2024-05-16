// nest/index.ts

import { ISimulatorProps } from "..";

import nestIconSet from "./components/iconSet";
import nestRoute from "./routes";
import types from "./helpers/types";
import { nestCompletions } from "./codemirror/nestCompletion";
import { nestRandomCompletions } from "./codemirror/nestRandomCompletion";
import { nestSpatialCompletions } from "./codemirror/nestSpatialCompletion";
import { nestSpatialDistributionsCompletions } from "./codemirror/nestSpatialDistributionsCompletion";
import { useInsiteAccessStore } from "./stores/backends/insiteAccessStore";
import { useNESTModelDBStore } from "./stores/model/modelDBStore";
import { useNESTProjectDBStore } from "./stores/project/projectDBStore";
import { useNESTSimulatorStore } from "./stores/backends/nestSimulatorStore";

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
    // Init stores.
    const modelDBStore = useNESTModelDBStore();
    const projectDBStore = useNESTProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Init backend NEST Simulator.
    const nestSimulatorStore = useNESTSimulatorStore();

    // Customize headers to authenticate on NEST Server.
    nestSimulatorStore.updateAccessToken = () => {
      // Add token to axios instance header.
      if (nestSimulatorStore.state.accessToken) {
        nestSimulatorStore.axiosInstance().defaults.headers.common[
          "NESTServerAuth"
        ] = nestSimulatorStore.state.accessToken;
      }
    };

    // Init backend Insite Access.
    const insiteAccessStore = useInsiteAccessStore();

    nest.backends = {
      insite: insiteAccessStore,
      nest: nestSimulatorStore,
    };
  },
  route: nestRoute,
  title: "NEST",
  theme: {
    nest: "ff6633",
    "nest-model": "ff6633",
    "nest-project": "1281b3",
  },
  types,
};
