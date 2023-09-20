// index.ts

import router from "@/router";
import { Config } from "@/helpers/config";
import { addTheme, addIconSet } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import nestRoute from "./routes";
import { nestIconSet } from "./components/iconsets";

import { useInsiteAccessStore } from "./store/backends/insiteAccessStore";
import { useNESTModelDBStore } from "./store/model/modelDBStore";
import { useNESTModelStore } from "./store/model/modelStore";
import { useNESTProjectDBStore } from "./store/project/projectDBStore";
import { useNESTProjectStore } from "./store/project/projectStore";
import { useNESTSessionStore } from "./store/sessionStore";
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
  install() {

    // Load config files.
    _configNames.forEach((configName) => new Config(configName, 'nest'));

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
      backends: [insiteAccessStore, nestSimulatorStore],
      color: "nest",
      databases: ["NEST_MODEL_STORE", "NEST_PROJECT_STORE"],
      icon: "nest:logo",
      id: "nest",
      routerName: "nestHome",
      title: "NEST",
    };

    // Add router for NEST
    router.addRoute("appLayout", nestRoute);

    // Init stores
    const nestSessionStore = useNESTSessionStore();
    const modelDBStore = useNESTModelDBStore();
    const modelStore = useNESTModelStore();
    const projectDBStore = useNESTProjectDBStore();
    const projectStore = useNESTProjectStore();

    Promise.all([modelDBStore.init(), projectDBStore.init()]).then(() => {
      setTimeout(() => {
        modelStore.init();
        projectStore.init();
        nestSessionStore.loading = false;
      }, 300); // TODO: find better solution for setTimeout.
    });

  },
};
