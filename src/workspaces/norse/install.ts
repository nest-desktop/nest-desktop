// norse/index.ts

import { defineViewStore } from "@/nav";

import type { IWorkspaceProps } from "../install";
import { norseTorchCompletions } from "./codemirror/norseTorchCompletion";
import iconSet from "./components/iconsets";
import route from "./routes";
import { initNorseSimulator } from "./backends/norseSimulator";
import { useNorseModelDBStore, useNorseModelStore } from "./model/stores";
import { useNorseProjectDBStore, useNorseProjectStore } from "./project/stores";

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
      norse: initNorseSimulator(),
    };

    norse.views = {
      project: defineViewStore({
        name: "project",
        workspace: "norse",
        views: {
          controller: "",
          graph: "network",
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
  },
  route,
  stores: {},
  theme: {
    "norse-accent": "#e6007e",
    "norse-green": "#0F9959",
    "norse-logo": "#000080",
    "norse": "#e6007e",
  },
  title: "Norse",
  views: {},
};
