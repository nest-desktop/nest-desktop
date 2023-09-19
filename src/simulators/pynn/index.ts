// index.ts

import router from "@/router";
import { addIconSet, addTheme } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import pynnRoute from "./routes";
import { pynnIconSet } from "./components/iconsets";

import { usePyNNModelDBStore } from "./store/model/modelDBStore";
import { usePyNNModelStore } from "./store/model/modelStore";
import { usePyNNProjectDBStore } from "./store/project/projectDBStore";
import { usePyNNProjectStore } from "./store/project/projectStore";
import { usePyNNSessionStore } from "./store/sessionStore";
import { usePyNNSimulatorStore } from "./store/backends/pynnSimulatorStore";

export default {
  install() {
    router.addRoute("appLayout", pynnRoute);

    addTheme({
      "pynn-logo": "#000080",
      pynn: "0F9959",
      "pynn-accent": "#e6007e",
    });

    addIconSet({ pynn: pynnIconSet });

    const pynnSimulatorStore = usePyNNSimulatorStore();
    pynnSimulatorStore.init();

    simulatorItems.pynn = {
      backends: [pynnSimulatorStore],
      databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
      icon: "pynn:logo",
      id: "pynn",
      routerName: "pynnHome",
      title: "PyNN",
    };

    const pynnSessionStore = usePyNNSessionStore();
    const modelDBStore = usePyNNModelDBStore();
    const modelStore = usePyNNModelStore();
    const projectDBStore = usePyNNProjectDBStore();
    const projectStore = usePyNNProjectStore();

    Promise.all([modelDBStore.init(), projectDBStore.init()]).then(() => {
      setTimeout(() => {
        modelStore.init();
        projectStore.init();
        pynnSessionStore.loading = false;
      }, 300); // TODO: find better solution for setTimeout.
    });
  },
};
