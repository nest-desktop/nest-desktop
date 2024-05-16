// norse/index.ts

import { ISimulatorProps } from "..";

import iconSet from "./components/iconSet";
import route from "./routes";
import types from "./helpers/types";
import { norseTorchCompletions } from "./codemirror/norseTorchCompletion";
import { useNorseModelDBStore } from "./stores/model/modelDBStore";
import { useNorseProjectDBStore } from "./stores/project/projectDBStore";
import { useNorseSimulatorStore } from "./stores/backends/norseSimulatorStore";

export const norse: ISimulatorProps = {
  autocomplete: [norseTorchCompletions],
  backends: {},
  configNames: ["NorseModel"],
  databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
  iconSet,
  id: "norse",
  init: () => {
    // Init stores.
    const modelDBStore = useNorseModelDBStore();
    const projectDBStore = useNorseProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Init backend Norse Simulator.
    const norseSimulatorStore = useNorseSimulatorStore();

    norse.backends = {
      norse: norseSimulatorStore,
    };
  },
  route,
  title: "Norse",
  theme: {
    "norse-accent": "#e6007e",
    "norse-green": "#0F9959",
    "norse-logo": "#000080",
    norse: "#e6007e",
  },
  types,
};
