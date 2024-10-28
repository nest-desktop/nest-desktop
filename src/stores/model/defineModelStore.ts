// defineModelStore.ts

import { Store, defineStore } from "pinia";
import { computed, reactive } from "vue";

import { TElementType } from "@/helpers/model/model";
import router from "@/router";
import { TModel, TProject } from "@/types";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "../appStore";
import { TModelDBStore } from "./defineModelDBStore";
import { useModelDBStore } from "./modelDBStore";

interface IModelStoreState {
  modelId: string;
  models: string[];
  project?: TProject;
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
       * @returns
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
        model,
        newModel,
        props,
        routeTo,
        saveModel,
        startSimulation,
        state,
        updateRecentAddedModels,
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
