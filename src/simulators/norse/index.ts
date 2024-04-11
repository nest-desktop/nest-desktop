// norse/index.ts

import { ISimulatorProps } from "..";

import norseIconSet from "./components/iconSet";
import norseRoute from "./routes";
import { norseTorchCompletions } from "./codemirror/norseTorchCompletion";

import { useNorseModelDBStore } from "./stores/model/modelDBStore";
import { useNorseProjectDBStore } from "./stores/project/projectDBStore";
import { useNorseSimulatorStore } from "./stores/backends/norseSimulatorStore";

export const norse: ISimulatorProps = {
  autocomplete: [norseTorchCompletions],
  backends: {},
  configNames: ["NorseModel"],
  databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
  iconSet: norseIconSet,
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
  title: "Norse",
  route: norseRoute,
  theme: {
    "norse-accent": "#e6007e",
    "norse-green": "#0F9959",
    "norse-logo": "#000080",
    norse: "#e6007e",
  },
};
