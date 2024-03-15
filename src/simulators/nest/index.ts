// nest/index.ts

import { ISimulatorProps } from "..";

import nestRoute from "./routes";
import nestIconSet from "./components/iconSet";

import { useInsiteAccessStore } from "./stores/backends/insiteAccessStore";
import { useNESTModelDBStore } from "./stores/model/modelDBStore";
import { useNESTProjectDBStore } from "./stores/project/projectDBStore";
import { useNESTSimulatorStore } from "./stores/backends/nestSimulatorStore";

export const nest: ISimulatorProps = {
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
    nestSimulatorStore.init();
    // Init backend Insite Access.
    const insiteAccessStore = useInsiteAccessStore();
    insiteAccessStore.init();

    nest.backends = {
      insite: insiteAccessStore,
      nest: nestSimulatorStore,
    };
  },
  title: "NEST",
  route: nestRoute,
  theme: {
    nest: "ff6633",
  },
};
