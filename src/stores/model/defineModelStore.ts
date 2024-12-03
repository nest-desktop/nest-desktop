// defineModelStore.ts

import { Store, defineStore } from "pinia";
import { computed, nextTick, reactive } from "vue";

import { TElementType } from "@/helpers/model/model";
import { IProjectProps } from "@/helpers/project/project";
import router from "@/router";
import { TModel, TProject } from "@/types";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "../appStore";
import { TModelDBStore } from "./defineModelDBStore";
import { useModelDBStore } from "./modelDBStore";

interface IModelStoreState {
  modelId: string;
  models: string[];
  project: TProject | null;
  projectId: string;
  projectFilename?: string;
  recentAddedModels: Record<TElementType, string[]>;
}

export type TModelStore = Store<
  string,
  | {
      modelId: string;
      model: () => TModel;
      state: IModelStoreState;
      toggle: (item?: { id: string }) => void;
    }
  | any
>;

export function defineModelStore(
  props: {
    defaultView?: string;
    loggerMinLevel?: number;
    simulator: string;
    useModelDBStore: TModelDBStore;
  } = {
    simulator: "base",
    useModelDBStore,
  }
): TModelStore {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 3,
    name: props.simulator + " model store",
  });

  return defineStore(
    props.simulator + "-model",
    () => {
      const state = reactive<IModelStoreState>({
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
      });

      const model = computed(() => getModel(state.modelId));

      /**
       * Find model from the list.
       * @param modelId model Id
       * @returns model object
       */
      const findModel = (modelId: string) =>
        state.models.find((model: any) => model.id === modelId);

      /**
       * Get model from the db list.
       * @param modelId model Id
       * @returns model object
       */
      const getModel = (modelId: string) => {
        const modelDBStore: TModelStore = props.useModelDBStore();
        return modelDBStore.findModel(modelId) || findModel(modelId);
      };

      /**
       * Initialize model store.
       */
      const init = (): void => {
        logger.trace("init");

        const modelDBStore: TModelDBStore = props.useModelDBStore();
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

        const modelDBStore: TModelStore = props.useModelDBStore();
        const model = modelDBStore.getModel(modelId);
        state.modelId = model.id;
      };

      /**
       * Load project from assets.
       */
      const loadProjectfromAssets = (): void => {
        logger.trace("load project from assets:", state.projectId);
        const appStore = useAppStore();
        const projectStore = appStore.currentSimulator.stores.projectStore;

        loadJSON(
          `assets/simulators/${props.simulator}/projects/${state.projectId}.json`
        ).then((projectProps: IProjectProps) => {
          projectProps.filename = state.projectId;
          model.value.project = new projectStore.props.Project(projectProps);
          updateProject();
        });
      };

      /**
       * New model.
       * @param modelId string
       */
      const newModel = (modelId: string): void => {
        logger.trace("new model");

        const modelDBStore: TModelStore = props.useModelDBStore();
        const model = modelDBStore.newModel({ id: modelId });
        state.modelId = model.id;
      };

      /**
       * Redirect to route path of current model.
       * @returns { path: string }
       */
      const routeTo = (): { path: string } => {
        const appStore = useAppStore();
        const modelViewStore = appStore.currentSimulator.views.model;

        return {
          path:
            "/" +
            props.simulator +
            "/model/" +
            state.modelId +
            "/" +
            modelViewStore.state.views.main,
        };
      };

      /**
       * Save current model to the database.
       */
      const saveModel = (): void => {
        logger.trace("save model");

        const modelDBStore: TModelDBStore = props.useModelDBStore();
        modelDBStore.saveModel(model.value);
      };

      /**
       * Select project
       * @param projectId
       */
      const selectProject = (
        projectId: string,
        callback?: () => void
      ): void => {
        logger.trace("select project", projectId);

        state.projectId = projectId;
        callback ? callback() : updateProject();
      };

      /**
       * Start simulation of the current project.
       */
      const startSimulation = (): void => {
        logger.trace("start simulation:", truncate(state.project?.id));

        router
          .push({
            name: props.simulator + "ModelExplorer",
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

        if (
          model.value.project &&
          model.value.project?.filename === state.projectId
        ) {
          state.project = model.value.project;
          const project = state.project;

          if (project) {
            project.network.nodes.neurons.forEach((neuron) => {
              neuron._modelId = state.modelId;
              neuron.loadModel();
            });

            nextTick(() => {
              project.network.nodes.neurons.forEach((neuron) => {
                neuron.showAllParams(false);
              });

              project.network.nodes.updateRecords();
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
      const updateRecentAddedModels = (
        modelId: string,
        elementType: TElementType
      ) => {
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
    }
  );
}
