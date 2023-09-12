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

export default {
  install() {
    router.addRoute("appLayout", pynnRoute);

    addTheme({
      "pynn-logo": "#000080",
      pynn: "0F9959",
      "pynn-accent": "#e6007e",
    });

    addIconSet({ pynn: pynnIconSet });

    simulatorItems.pynn = {
      id: "pynn",
      title: "PyNN",
      routerName: "pynnHome",
      icon: "pynn:logo",
      databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
    };

    const pynnSessionStore = usePyNNSessionStore();
    const modelDBStore = usePyNNModelDBStore();
    const modelStore = usePyNNModelStore();
    const projectDBStore = usePyNNProjectDBStore();
    const projectStore = usePyNNProjectStore();

    Promise.all([modelDBStore.init(), projectDBStore.init()]).then(() => {
      modelStore.init();
      projectStore.init();
      pynnSessionStore.loading = false;
    });
  },
};
