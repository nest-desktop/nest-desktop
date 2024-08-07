// modelStore.ts

import { TModelStore, defineModelStore } from "@/stores/model/defineModelStore";

import { IModule, useNESTModuleStore } from "../moduleStore";
import { useNESTModelDBStore } from "./modelDBStore";

export const useNESTModelStore = defineModelStore({
  simulator: "nest",
  useModelDBStore: useNESTModelDBStore,
  defaultView: "doc",
});

export const updateSimulationModules = (): void => {
  const modelStore: TModelStore = useNESTModelStore();

  const moduleStore = useNESTModuleStore();

  modelStore.state.project.simulation.modules = moduleStore.state.modules
    .filter((module: IModule) =>
      module.models.includes(modelStore.state.modelId)
    )
    .map((module: IModule) => module.name);
};
