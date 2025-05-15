// norse/index.ts

import { defineViewStore } from "@/stores/defineViewStore";
import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";

import iconSet from "./components/iconSet";
import route from "./routes";
import { IWorkspaceProps } from "../";
import { norseSimulatorInit } from "./stores/backends/norseSimulatorStore";
import { norseTorchCompletions } from "./codemirror/norseTorchCompletion";
import { useNorseModelDBStore } from "./stores/model/modelDBStore";
import { useNorseModelStore } from "./stores/model/modelStore";
import { useNorseProjectDBStore } from "./stores/project/projectDBStore";
import { useNorseProjectStore } from "./stores/project/projectStore";

export const norse: IWorkspaceProps = {
  backends: {},
  completionSources: [norseTorchCompletions],
  configNames: ["NorseModel"],
  databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
  iconSet,
  id: "norse",
  init: () => {
    // Initialize stores.
    const modelDBStore = useNorseModelDBStore();
    const projectDBStore = useNorseProjectDBStore();
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

    norse.views = {
      project: defineViewStore({
        name: "project",
        workspace: "norse",
        views: {
          controller: "",
          main: "edit",
        },
      })(),
      model: defineViewStore({
        name: "model",
        workspace: "norse",
        views: {
          controller: "",
          main: "edit",
        },
      })(),
    };

    registerCodeNodeTypes(["norse", "torch"]);
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
  views: {},
};
