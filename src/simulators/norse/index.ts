// index.ts

import router from "@/router";
import { Config } from "@/helpers/config";
import { addIconSet, addTheme } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import norseRoute from "./routes";
import { norseIconSet } from "./components/iconsets";

import { useNorseModelDBStore } from "./stores/model/modelDBStore";
import { useNorseProjectDBStore } from "./stores/project/projectDBStore";
import { useNorseSimulatorStore } from "./stores/backends/norseSimulatorStore";

const _configNames = ["NorseModel"];

export default {
  install() {
    // Load config files
    _configNames.forEach((configName) => new Config(configName, "norse"));

    // Init stores
    const modelDBStore = useNorseModelDBStore();
    const projectDBStore = useNorseProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Init backend Norse Simulator
    const norseSimulatorStore = useNorseSimulatorStore();
    norseSimulatorStore.init();

    // Add theme to vuetify
    addTheme({
      "norse-logo": "#000080",
      norse: "0F9959",
      "norse-accent": "#e6007e",
    });

    // Add icon set for vuetify
    addIconSet({ norse: norseIconSet });

    // Add settings for App navigation
    simulatorItems.norse = {
      backends: { norse: norseSimulatorStore },
      databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
      icon: "norse:logo",
      id: "norse",
      routerName: "norseHome",
      title: "Norse",
    };

    // Add router
    router.addRoute("appLayout", norseRoute);
  },
};
