// pynn/index.ts

import { TBackendStore } from "@/stores/defineBackendStore";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { ISimulatorProps } from "../";
import iconSet from "./components/iconSet";
import types from "./helpers/types";
import route from "./routes";
import { usePyNNSimulatorStore } from "./stores/backends/pynnSimulatorStore";
import { usePyNNModelDBStore } from "./stores/model/modelDBStore";
import { usePyNNProjectDBStore } from "./stores/project/projectDBStore";

export const pynn: ISimulatorProps = {
  autocomplete: [],
  backends: {},
  configNames: ["PyNNModel"],
  databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
  iconSet,
  id: "pynn",
  init: () => {
    // Initialize stores
    const modelDBStore: TModelDBStore = usePyNNModelDBStore();
    const projectDBStore: TProjectDBStore = usePyNNProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Initialize backend PyNN Simulator
    const pynnSimulatorStore: TBackendStore = usePyNNSimulatorStore();
    pynnSimulatorStore.init();

    pynn.backends = {
      pynn: pynnSimulatorStore,
    };
  },
  route,
  title: "PyNN",
  theme: {
    "pynn-accent": "#e6007e",
    "pynn-logo": "#000080",
    pynn: "#0F9959",
  },
  types,
};
