// index.ts

import router from "@/router";
import { Config } from "@/helpers/config";
import { addTheme, addIconSet } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import nestRoute from "./routes";
import { nestIconSet } from "./components/iconsets";

import { useInsiteAccessStore } from "./stores/backends/insiteAccessStore";
import { useNESTModelDBStore } from "./stores/model/modelDBStore";
import { useNESTProjectDBStore } from "./stores/project/projectDBStore";
import { useNESTSimulatorStore } from "./stores/backends/nestSimulatorStore";

const _configNames = [
  "NESTConnection",
  "NESTConnectionMask",
  "NESTModel",
  "NESTNodeSlice",
  "NESTNodeSpatial",
  "NESTSimulationKernel",
];

export default {
  async install() {
    // Load config files
    _configNames.forEach((configName) => new Config(configName, "nest"));

    // Init stores
    const modelDBStore = useNESTModelDBStore();
    const projectDBStore = useNESTProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Init backend NEST Simulator
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

    // Init backend Insite Access
    const insiteAccessStore = useInsiteAccessStore();
    insiteAccessStore.init();

    // Add theme to vuetify
    addTheme({
      nest: "ff6633",
    });

    // Add icon set for vuetify
    addIconSet({ nest: nestIconSet });

    // Add settings for App navigation
    simulatorItems.nest = {
      backends: { insite: insiteAccessStore, nest: nestSimulatorStore },
      color: "nest",
      databases: ["NEST_MODEL_STORE", "NEST_PROJECT_STORE"],
      icon: "nest:logo",
      id: "nest",
      routerName: "nestHome",
      title: "NEST",
    };

    // Add router
    router.addRoute("appLayout", nestRoute);
  },
};
