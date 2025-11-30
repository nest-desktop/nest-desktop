// defineModelStore.ts

import { defineStore } from "pinia";
import { computed, nextTick, reactive } from "vue";
import type { RouteLocationNormalizedLoadedGeneric } from "vue-router";

import router from "@/router";
import type { Class, TNetwork, TSimulation, TStore } from "@/types";
import type { TElementType } from "@/model";
import { BaseProject, type IProjectState } from "@/project";
import { loadJSON, logger as mainLogger, truncate } from "@/utils";
import { useAppStore } from "@/app";

import { useModelDBStore } from "./modelDBStore";

export interface IModelState {
  id: string;
  label: string;
  elementType: string;
}

interface IModelStoreState<TProject extends BaseProject = BaseProject> {
  modelId: string;
  models: IModelState[];
  project: TProject | null;
  projectId: string;
  projectFilename?: string;
  recentAddedModels: Record<TElementType, string[]>;
  stopwatch: {
    build: number;
  };
}

export function defineModelStore<TProject extends BaseProject = BaseProject>(
  props: {
    Project: Class<TProject | BaseProject>;
    workspace: string;
    useModelDBStore: TStore;
  } = {
    Project: BaseProject,
    useModelDBStore,
    workspace: "base",
  },
) {
  const logger = mainLogger.getSubLogger({ name: props.workspace + " model store" });

  return defineStore(props.workspace + "-model", () => {
    const state = reactive<IModelStoreState<TProject | BaseProject>>({
      modelId: "",
      models: [],
      project: null,
      projectId: "",
      recentAddedModels: {
        neuron: [],
        recorder: [],
        stimulator: [],
        synapse: [],
      },
      stopwatch: {
        build: 0,
      },
    });

    const model = computed(() => getModel(state.modelId));

    /**
     * Find model from the list.
     * @param modelId model Id
     * @returns model instance
     */
    const findModel = (modelId: string) => state.models.find((model: IModelState) => model.id === modelId);

    /**
     * Get model from the db list.
     * @param modelId model Id
     * @returns model instance
     */
    const getModel = (modelId: string) => {
      const modelDBStore = props.useModelDBStore();
      return modelDBStore.findModel(modelId) || findModel(modelId);
    };

    /**
     * Initialize model store.
     */
    const init = (): void => {
      logger.trace("init");

      const modelDBStore = props.useModelDBStore();
      if (modelDBStore.state.models.length > 0) {
        state.modelId = modelDBStore.getRecentModelId();
      }
    };

    /**
     * Load model.
     * @param modelId string
     */
    const loadModel = (modelId: string = ""): void => {
      logger.trace("load model", truncate(modelId));

      const modelDBStore = props.useModelDBStore();
      const model = modelDBStore.getModel(modelId);
      state.modelId = model.id;
    };

    /**
     * Load project from assets.
     */
    const loadProjectfromAssets = (): void => {
      logger.trace("load project from assets:", state.projectId);

      loadJSON(`assets/workspaces/${props.workspace}/projects/${state.projectId}.json`).then(
        (projectState: IProjectState) => {
          projectState.filename = state.projectId;
          model.value.project = new props.Project(projectState);
          updateProject();
        },
      );
    };

    /**
     * New model.
     * @param modelId string
     */
    const newModel = (modelId: string): void => {
      logger.trace("new model");

      const modelDBStore = props.useModelDBStore();
      const model = modelDBStore.newModel({ id: modelId });
      state.modelId = model.id;
    };

    /**
     * Redirect to route path of current model.
     * @returns route
     */
    const routeTo = (): RouteLocationNormalizedLoadedGeneric => {
      const appStore = useAppStore();

      let routerMainView = "edit";
      if (appStore.currentWorkspace) {
        const modelViewStore = appStore.currentWorkspace.views.model;
        routerMainView = modelViewStore.state.views.main;
      }

      return {
        path: "/" + props.workspace + "/model/" + state.modelId + "/" + routerMainView,
      } as RouteLocationNormalizedLoadedGeneric;
    };

    /**
     * Save current model to the database.
     */
    const saveModel = (): void => {
      logger.trace("save model");

      const modelDBStore = props.useModelDBStore();
      modelDBStore.saveModel(model.value);
    };

    /**
     * Select project
     * @param projectId
     */
    const selectProject = (projectId: string, callback?: () => void): void => {
      logger.trace("select project", projectId);

      state.projectId = projectId;
      if (callback) {
        callback();
      } else {
        updateProject();
      }
    };

    /**
     * Start simulation of the current project.
     */
    const startSimulation = (): void => {
      logger.trace("start simulation:", state.project?.shortId);

      router
        .push({
          name: props.workspace + "ModelExplorer",
          params: { modelId: state.modelId },
        })
        .then(() => {
          // TODO: nextTick doesn't work.
          if ("startSimulation" in state.project) setTimeout(() => state.project?.startSimulation(), 100);
        });
    };

    const updateProject = () => {
      logger.trace("update");

      if (!model.value || !model.value.isNeuron) {
        state.project = null;
        return;
      }

      if (model.value.project && model.value.project?.filename === state.projectId) {
        state.project = model.value.project;
        const project = state.project as TProject;

        if (project) {
          if ("network" in project) {
            const network = project.network as TNetwork;
            network.nodes.neurons.forEach((neuron) => {
              neuron.modelId = state.modelId;
            });
          }

          nextTick(() => {
            if ("network" in project) {
              const network = project.network as TNetwork;
              network.nodes.neurons.forEach((neuron) => neuron.showAllParams(false));
              network.nodes.updateRecords();
            }

            if ("simulation" in project) {
              const simulation = project.simulation as TSimulation;
              simulation.init();
            }

            project.activities.init();
            project.activityGraph.init();
          });
        }
      } else {
        loadProjectfromAssets();
      }
    };

    /**
     * Update recent added models.
     * @param modelId string
     * @param elementType neuron, recorder, stimulator
     */
    const updateRecentAddedModels = (modelId: string, elementType: TElementType) => {
      const models = state.recentAddedModels[elementType];
      if (models.includes(modelId)) models.splice(models.indexOf(modelId), 1);
      models.unshift(modelId);
      state.recentAddedModels[elementType] = models.slice(0, 3);
    };

    return {
      getModel,
      init,
      loadModel,
      loadProjectfromAssets,
      model,
      newModel,
      props,
      routeTo,
      saveModel,
      selectProject,
      startSimulation,
      state,
      updateRecentAddedModels,
      updateProject,
    };
  });
}
