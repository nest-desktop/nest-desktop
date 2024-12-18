// modelStore.ts

import { nextTick } from "vue";

import { defineModelStore } from "@/stores/model/defineModelStore";
import { logger as mainLogger } from "@/utils/logger";

import { NESTNode, NESTSimulation } from "../../types";
import { IModule, useNESTModuleStore } from "../moduleStore";
import { useNESTModelDBStore } from "./modelDBStore";

export const useNESTModelStore = defineModelStore({
  workspace: "nest",
  useModelDBStore: useNESTModelDBStore,
  defaultView: "doc",
});

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest model store",
});

export const updateProject = () => {
  logger.trace("update project");
  const modelStore = useNESTModelStore();

  if (!modelStore.model || !modelStore.model.isNeuron) {
    modelStore.state.project = null;
    return;
  }

  if (modelStore.model?.project && modelStore.model.project?.filename === modelStore.state.projectId) {
    modelStore.state.project = modelStore.model.project;
    const project = modelStore.state.project;

    if (project) {
      updateSimulationModules(false);

      const neurons = project.network.nodes.neurons as NESTNode[];

      neurons.forEach((neuron: NESTNode) => {
        neuron._modelId = modelStore.state.modelId;
        neuron.loadModel();
      });

      nextTick(() => {
        neurons.forEach((neuron: NESTNode) => {
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
  const modelStore = useNESTModelStore();
  const moduleStore = useNESTModuleStore();

  const simulation = modelStore.state.project?.simulation as NESTSimulation;
  simulation.modules = moduleStore.state.modules
    .filter((module: IModule) => module.models.includes(modelStore.state.modelId))
    .map((module: IModule) => module.name);

  if (emitChanges) modelStore.state.project?.simulation.changes();
};
