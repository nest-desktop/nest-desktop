// modelStore.ts

import { computed, nextTick } from "vue";

import { defineModelStore } from "@/model";
import { logger as mainLogger } from "@/utils";

import type { NESTNode } from "../../types";
import { NESTProject } from "../../project";
import { type IModule, useNESTModuleStore } from "../../module";

import { useNESTModelDBStore } from "./modelDBStore";

export const useNESTModelStore = defineModelStore<NESTProject>({
  Project: NESTProject,
  useModelDBStore: useNESTModelDBStore,
  workspace: "nest",
});

const logger = mainLogger.getSubLogger({ name: "nest model store" });

export const currentModel = computed(() => {
  const modelStore = useNESTModelStore();
  return modelStore.getModel(modelStore.state.modelId);
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

      if ("network" in project) {
        const neurons = project.network.nodes.neurons;
        neurons.forEach((neuron: NESTNode) => {
          neuron.loadModel(modelStore.state.modelId);
        });
      }

      nextTick(() => {
        if ("network" in project) {
          const neurons = project.network.nodes.neurons;
          neurons.forEach((neuron: NESTNode) => neuron.showAllParams(false));
          project.network.nodes.updateRecords();
        }

        if ("simulation" in project) project.simulation.init();
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
  if (!(modelStore.state.project && "simulation" in modelStore.state.project)) return;

  const simulation = modelStore.state.project.simulation;

  const moduleStore = useNESTModuleStore();
  simulation.modules = moduleStore.state.modules
    .filter((module: IModule) => module.models.includes(modelStore.state.modelId))
    .map((module: IModule) => module.name);

  if (emitChanges) modelStore.state.project?.simulation.changes();
};
