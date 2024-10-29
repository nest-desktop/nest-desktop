// modelStore.ts

import { nextTick } from "vue";

import { TModelStore, defineModelStore } from "@/stores/model/defineModelStore";
import { logger as mainLogger } from "@/utils/logger";

import { NESTNode } from "../../types";
import { IModule, useNESTModuleStore } from "../moduleStore";
import { useNESTModelDBStore } from "./modelDBStore";

export const useNESTModelStore = defineModelStore({
  simulator: "nest",
  useModelDBStore: useNESTModelDBStore,
  defaultView: "doc",
});

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest model store",
});

export const updateProject = () => {
  logger.trace("update project");
  const modelStore: TModelStore = useNESTModelStore();

  if (!modelStore.model || !modelStore.model.isNeuron) {
    modelStore.state.project = undefined;
    return;
  }

  if (
    modelStore.model?.project &&
    modelStore.model.project?.filename === modelStore.state.projectId
  ) {
    modelStore.state.project = modelStore.model.project;
    const project = modelStore.state.project;

    if (project) {
      updateSimulationModules(false);

      project.network.nodes.neurons.forEach((neuron: NESTNode) => {
        neuron._modelId = modelStore.state.modelId;
        neuron.loadModel();
      });

      nextTick(() => {
        project.network.nodes.neurons.forEach((neuron: NESTNode) => {
          neuron.showAllParams(false);
        });

        project.network.nodes.updateRecords();
        project.simulation.init();
        project.activities.init();
        project.activityGraph.init();
      });
    }
  } else {
    modelStore.loadProjectfromAssets();
  }
};

export const updateSimulationModules = (emitChanges: boolean = true): void => {
  const modelStore: TModelStore = useNESTModelStore();
  const moduleStore = useNESTModuleStore();

  modelStore.state.project.simulation.modules = moduleStore.state.modules
    .filter((module: IModule) =>
      module.models.includes(modelStore.state.modelId)
    )
    .map((module: IModule) => module.name);

  if (emitChanges) modelStore.state.project.simulation.changes();
};
