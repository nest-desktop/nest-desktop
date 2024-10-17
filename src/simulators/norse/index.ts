// norse/index.ts

import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";

import { ISimulatorProps } from "../";
import { norseTorchCompletions } from "./codemirror/norseTorchCompletion";
import iconSet from "./components/iconSet";
import types from "./helpers/types";
import route from "./routes";
import { norseSimulatorInit } from "./stores/backends/norseSimulatorStore";
import { useNorseModelDBStore } from "./stores/model/modelDBStore";
import { useNorseModelStore } from "./stores/model/modelStore";
import { useNorseProjectDBStore } from "./stores/project/projectDBStore";
import { useNorseProjectStore } from "./stores/project/projectStore";

export const norse: ISimulatorProps = {
  backends: {},
  completionSources: [norseTorchCompletions],
  configNames: ["NorseModel"],
  databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
  iconSet,
  id: "norse",
  init: () => {
    // Initialize stores.
    const modelDBStore: TModelDBStore = useNorseModelDBStore();
    const projectDBStore: TProjectDBStore = useNorseProjectDBStore();
    Promise.all([modelDBStore.init(), projectDBStore.init()]);

    const modelStore = useNorseModelStore();
    const projectStore = useNorseProjectStore();

    norse.stores = {
      modelDBStore,
      modelStore,
      projectDBStore,
      projectStore,
    };

    norse.backends = {
      norse: norseSimulatorInit(),
    };
  },
  route,
  stores: {},
  theme: {
    "norse-accent": "#e6007e",
    "norse-green": "#0F9959",
    "norse-logo": "#000080",
    norse: "#e6007e",
  },
  title: "Norse",
  types,
};
