// index.ts

import router from "@/router";
import { Config } from "@/helpers/config";
import { addIconSet, addTheme } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import norseRoute from "./routes";
import { norseIconSet } from "./components/iconsets";

import { useNorseModelDBStore } from "./store/model/modelDBStore";
import { useNorseModelStore } from "./store/model/modelStore";
import { useNorseProjectDBStore } from "./store/project/projectDBStore";
import { useNorseProjectStore } from "./store/project/projectStore";
import { useNorseSessionStore } from "./store/sessionStore";
import { useNorseSimulatorStore } from "./store/backends/norseSimulatorStore";

const _configNames = ["NorseModel"];

export default {
  install() {
    _configNames.forEach((configName) => new Config(configName));

    const norseSimulatorStore = useNorseSimulatorStore();
    norseSimulatorStore.init();

    const norseSessionStore = useNorseSessionStore();
    const modelDBStore = useNorseModelDBStore();
    const modelStore = useNorseModelStore();
    const projectDBStore = useNorseProjectDBStore();
    const projectStore = useNorseProjectStore();

    Promise.all([modelDBStore.init(), projectDBStore.init()]).then(() => {
      setTimeout(() => {
        modelStore.init();
        projectStore.init();
        norseSessionStore.loading = false;
      }, 300); // TODO: find better solution for setTimeout.
    });

    addTheme({
      "norse-logo": "#000080",
      norse: "0F9959",
      "norse-accent": "#e6007e",
    });

    addIconSet({ norse: norseIconSet });

    simulatorItems.norse = {
      backends: [norseSimulatorStore],
      databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
      icon: "norse:logo",
      id: "norse",
      routerName: "norseHome",
      title: "Norse",
    };

    router.addRoute("appLayout", norseRoute);
  },
};
