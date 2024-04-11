// pynn/index.ts

import { ISimulatorProps } from "..";

import pynnIconSet from "./components/iconSet";
import pynnRoute from "./routes";

import { usePyNNModelDBStore } from "./stores/model/modelDBStore";
import { usePyNNProjectDBStore } from "./stores/project/projectDBStore";
import { usePyNNSimulatorStore } from "./stores/backends/pynnSimulatorStore";

export const pynn: ISimulatorProps = {
  autocomplete: [],
  backends: {},
  configNames: ["PyNNModel"],
  databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
  iconSet: pynnIconSet,
  id: "pynn",
  init: () => {
    // Init stores
    const modelDBStore = usePyNNModelDBStore();
    const projectDBStore = usePyNNProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Init backend PyNN Simulator
    const pynnSimulatorStore = usePyNNSimulatorStore();
    pynnSimulatorStore.init();

    pynn.backends = {
      pynn: pynnSimulatorStore,
    };
  },
  title: "PyNN",
  route: pynnRoute,
  theme: {
    "pynn-accent": "#e6007e",
    "pynn-logo": "#000080",
    pynn: "#0F9959",
  },
};
