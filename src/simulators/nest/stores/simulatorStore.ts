// simulatorStore.ts

import { Store, defineStore } from "pinia";
import { reactive } from "vue";

interface ISimulatorStoreState {
  modules: string[];
  selectedModule: string;
}

export type TSimulatorStore = Store<string, any>;

export const useSimulatorStore: TSimulatorStore = defineStore(
  "simulator-store",
  () => {
    const state = reactive<ISimulatorStoreState>({
      modules: ["nestmlmodule", "insitemodule"],
      selectedModule: "nestmlmodule",
    });

    const addModule = (module: string) => {
      if (typeof module === "string" && module.length > 0 && module.trim()) {
        if (!state.modules.includes(module)) {
          state.modules.push(module);
        }
      }
    };

    const removeModule = (module: string) => {
      const index = state.modules.indexOf(module);
      state.modules.splice(index, 1);
    };

    return { addModule, removeModule, state };
  },
  {
    persist: true,
  }
);
