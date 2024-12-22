// defineModelStore.ts

import { defineStore } from "pinia";
import { computed, nextTick, reactive } from "vue";

import router from "@/router";
import { BaseProject, IBaseProjectProps } from "@/helpers/project/project";
import { TElementType } from "@/helpers/model/model";
import { Class, TNetwork, TRoute, TStore } from "@/types";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "../appStore";
import { useModelDBStore } from "./modelDBStore";

export interface IModelProps {
  id: string;
  label: string;
  elementType: string;
}

interface IModelStoreState<TProject extends BaseProject = BaseProject> {
  modelId: string;
  models: IModelProps[];
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
    defaultView?: string;
    loggerMinLevel?: number;
    useModelDBStore: TStore;
    workspace: string;
  } = {
    Project: BaseProject,
    useModelDBStore,
    workspace: "base",
  },
) {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 3,
    name: props.workspace + " model store",
  });

  return defineStore(
    props.workspace + "-model",
    () => {
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
       * @returns model object
       */
      const findModel = (modelId: string) => state.models.find((model: IModelProps) => model.id === modelId);

      /**
       * Get model from the db list.
       * @param modelId model Id
       * @returns model object
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
          (projectProps: IBaseProjectProps) => {
            projectProps.filename = state.projectId;
            model.value.project = new props.Project(projectProps);
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
      const routeTo = (): TRoute => {
        const appStore = useAppStore();
        const modelViewStore = appStore.currentWorkspace.views.model;

        return {
          path: "/" + props.workspace + "/model/" + state.modelId + "/" + modelViewStore.state.views.main,
        };
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
        logger.trace("start simulation:", truncate(state.project?.id));

        router
          .push({
            name: props.workspace + "ModelExplorer",
            params: { modelId: state.modelId },
          })
          .then(() => {
            // TODO: nextTick doesn't work.
            setTimeout(() => state.project?.startSimulation(), 100);
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
                neuron._modelId = state.modelId;
                neuron.loadModel();
              });
            }

            nextTick(() => {
              if ("network" in project) {
                const network = project.network as TNetwork;
                network.nodes.neurons.forEach((neuron) => neuron.showAllParams(false));
                network.nodes.updateRecords();
              }

              project.simulation.init();
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
    },
    {
      persist: [
        {
          pick: ["state.recentAddedModels"],
          storage: localStorage,
        },
        {
          pick: ["state.bottomNav", "state.controller", "state.views"],
          storage: sessionStorage,
        },
      ],
    },
  );
}
