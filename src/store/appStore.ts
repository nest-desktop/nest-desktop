// appStore

import { defineStore } from "pinia";

export const simulatorItems: {
  [key: string]: {
    id: string;
    title: string;
    icon: string;
    color?: string;
    databases: string[];
  };
} = {
  nest: {
    id: "nest",
    title: "NEST",
    icon: "simulator:nest",
    color: "nest",
    databases: ["NEST_MODEL_STORE", "NEST_PROJECT_STORE"],
  },
  norse: {
    id: "norse",
    title: "Norse",
    icon: "simulator:norse",
    databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
  },
  pynn: {
    id: "pynn",
    title: "PyNN",
    icon: "simulator:pynn",
    databases: ["PYNN_MODEL_STORE", "PYNN_PROJECT_STORE"],
  },
};

//   { id: "nest", title: "NEST", icon: "simulator:nest", color: "nest" },
//   { id: "norse", title: "Norse", icon: "simulator:norse" },
//   { id: "pynn", title: "PyNN", icon: "simulator:pynn" },
//   // { id: "arbor", title: "Arbor", icon: "simulator:arbor" },
// ];

export const useAppStore = defineStore("nest-desktop-app-store", {
  state: () => ({
    darkMode: false,
    devMode: false,
    simulator: "nest",
    webGL: false,
  }),
  getters: {
    currentSimulator: (state) => simulatorItems[state.simulator],
  },
  persist: true,
});
