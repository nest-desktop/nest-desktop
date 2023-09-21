// index.ts

import router from "@/router";
import { Config } from "@/helpers/config";
import { addTheme, addIconSet } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import nestRoute from "./routes";
import { nestIconSet } from "./components/iconsets";

import { useInsiteAccessStore } from "./store/backends/insiteAccessStore";
import { useNESTModelDBStore } from "./store/model/modelDBStore";
import { useNESTProjectDBStore } from "./store/project/projectDBStore";
import { useNESTSimulatorStore } from "./store/backends/nestSimulatorStore";

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
    nestSimulatorStore.update = () => {
      // Add token to axios instance header.
      if (nestSimulatorStore.accessToken) {
        nestSimulatorStore.session.instance.defaults.headers.common[
          "NESTServerAuth"
        ] = nestSimulatorStore.accessToken;
      }
      nestSimulatorStore.init();
    };
    nestSimulatorStore.update();

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
