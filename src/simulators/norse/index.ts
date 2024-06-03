// norse/index.ts

import { ISimulatorProps } from "../";
import { norseTorchCompletions } from "./codemirror/norseTorchCompletion";
import iconSet from "./components/iconSet";
import types from "./helpers/types";
import route from "./routes";
import { useNorseSimulatorStore } from "./stores/backends/norseSimulatorStore";
import { useNorseModelDBStore } from "./stores/model/modelDBStore";
import { useNorseProjectDBStore } from "./stores/project/projectDBStore";

export const norse: ISimulatorProps = {
  autocomplete: [norseTorchCompletions],
  backends: {},
  configNames: ["NorseModel"],
  databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
  iconSet,
  id: "norse",
  init: () => {
    // Initialize stores.
    const modelDBStore = useNorseModelDBStore();
    const projectDBStore = useNorseProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    // Initialize backend Norse Simulator.
    const norseSimulatorStore = useNorseSimulatorStore();
    norseSimulatorStore.init();

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
