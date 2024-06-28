// moduleStore.ts

import { Store, defineStore } from "pinia";
import { reactive } from "vue";

export interface IModule {
  id: string;
  models: string[];
}

interface IModuleStoreState {
  modules: IModule[];
}

export type TModuleStore = Store<string, any>;

export const useModuleStore: TModuleStore = defineStore(
  "module-store",
  () => {
    const state = reactive<IModuleStoreState>({
      modules: [
        { id: "nestmlmodule", models: [] },
        { id: "insitemodule", models: [] },
      ],
    });

    const addModule = (moduleId: string) => {
      if (
        typeof moduleId === "string" &&
        moduleId.length > 0 &&
        moduleId.trim()
      ) {
        const moduleIds = state.modules.map((module: IModule) => module.id);
        if (!moduleIds.includes(moduleId)) {
          state.modules.push({ id: moduleId, models: [] });
        }
      }
    };

    const findModule = (moduleId: string) =>
      state.modules.find((module: IModule) => module.id === moduleId);

    const moduleIds = () => state.modules.map((module: IModule) => module.id);

    const removeModule = (module: string) => {
      const moduleIds = state.modules.map((module: IModule) => module.id);
      const index = moduleIds.indexOf(module);
      state.modules.splice(index, 1);
    };

    return { addModule, findModule, moduleIds, removeModule, state };
  },
  {
    persist: true,
  }
);
