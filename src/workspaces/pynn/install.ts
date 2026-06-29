// pynn/index.ts

import { defineViewStore } from "@/nav";

import { IWorkspaceProps } from "../install";
import iconSet from "./components/iconSet";
import route from "./routes";
import { initPyNNSimulator } from "./backends/pynnSimulator";
import { usePyNNModelDBStore, usePyNNModelStore } from "./model/stores";
import { usePyNNProjectDBStore, usePyNNProjectStore } from "./project/stores";

export const pynn: IWorkspaceProps = {
  backends: {},
  configNames: ["PyNNModel"],
  databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
  iconSet,
  id: "pynn",
  init: () => {
    // Initialize stores
    const modelDBStore = usePyNNModelDBStore();
    const projectDBStore = usePyNNProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    const modelStore = usePyNNModelStore();
    const projectStore = usePyNNProjectStore();

    pynn.stores = {
      modelDBStore,
      modelStore,
      projectDBStore,
      projectStore,
    };

    pynn.backends = {
      pynn: initPyNNSimulator(),
    };

    pynn.views = {
      project: defineViewStore({
        name: "project",
        workspace: "pynn",
        views: {
          controller: "",
          main: "edit",
        },
      })(),
      model: defineViewStore({
        name: "model",
        workspace: "pynn",
        views: {
          controller: "",
          main: "edit",
        },
      })(),
    };
  },
  route,
  stores: {},
  theme: {
    "pynn-accent": "#e6007e",
    "pynn-logo": "#000080",
    "pynn": "#0F9959",
  },
  title: "PyNN",
  views: {},
};
