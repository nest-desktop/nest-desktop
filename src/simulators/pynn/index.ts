// index.ts

import router from "@/router";
import { Config } from "@/helpers/config";
import { addIconSet, addTheme } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import pynnRoute from "./routes";
import { pynnIconSet } from "./components/iconsets";

import { usePyNNModelDBStore } from "./store/model/modelDBStore";
import { usePyNNProjectDBStore } from "./store/project/projectDBStore";
import { usePyNNSimulatorStore } from "./store/backends/pynnSimulatorStore";

const _configNames = ["PyNNModel"];

export default {
  install() {
    // Load config files
    _configNames.forEach((configName) => new Config(configName, "pynn"));

    // Init stores
    const modelDBStore = usePyNNModelDBStore();
    const projectDBStore = usePyNNProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Init backend PyNN Simulator
    const pynnSimulatorStore = usePyNNSimulatorStore();
    pynnSimulatorStore.init();

    // Add theme to vuetify
    addTheme({
      "pynn-logo": "#000080",
      pynn: "0F9959",
      "pynn-accent": "#e6007e",
    });

    // Add icon set for vuetify
    addIconSet({ pynn: pynnIconSet });

    // Add settings for App navigation
    simulatorItems.pynn = {
      backends: { pynn: pynnSimulatorStore },
      databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
      icon: "pynn:logo",
      id: "pynn",
      routerName: "pynnHome",
      title: "PyNN",
    };

    // Add router
    router.addRoute("appLayout", pynnRoute);
  },
};
