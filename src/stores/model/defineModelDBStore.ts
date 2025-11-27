// defineModelDBStore.ts

import { defineStore } from "pinia";
import { type UnwrapRef, reactive } from "vue";

import type { IDoc, IParamState } from "@/helpers/common";
import { BaseModel, type TElementType } from "@/helpers/model/model";
import { BaseModelDB } from "@/helpers/model/modelDB";
import type { Class, TModelDB, TModelState } from "@/types";
import { download } from "@/utils/download";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";
import { upgradeModel } from "@/helpers/upgrades";

import { useAppStore } from "../appStore";

interface IModelDBStoreState<TModel extends BaseModel = BaseModel> {
  initialized: boolean;
  models: TModel[];
  tryImports: number;
}

export function defineModelDBStore<TModel extends BaseModel = BaseModel>(
  props: {
    Model: Class<TModel | BaseModel>;
    ModelDB: Class<TModelDB>;
    modelAssets?: string[];
    workspace: string;
  } = {
    Model: BaseModel,
    ModelDB: BaseModelDB,
    workspace: "base",
  },
) {
  const logger = mainLogger.getSubLogger({ name: props.workspace + " model DB store" });

  const db = new props.ModelDB();

  return defineStore(props.workspace + "-model-db", () => {
    const state = reactive<IModelDBStoreState<TModel | BaseModel>>({
      initialized: false,
      models: [],
      tryImports: 3,
    });

    /**
     * Add model to the list.
     * @param model model instance
     */
    const _addToList = (model: TModel | BaseModel): void => {
      state.models.unshift(model);
    };

    /**
     * Add this new model to the list.
     * @param modelState model state
     * @remarks It pushes new model to the first line of the list.
     */
    const addModel = (modelState: TModelState): TModel => {
      logger.trace("add model:", modelState?.id);

      // Upgrade model state.
      modelState = upgradeModel(modelState);

      const model = new props.Model(modelState) as TModel;
      _addToList(model);
      return model;
    };

    /**
     * Delete model instance from the database and then list model.
     * @param model model instance
     * @returns Promise from PouchDB
     */
    const deleteModel = async (model: TModel | BaseModel): Promise<void> => {
      logger.trace("delete model:", model.id);

      return db.deleteModel(model).then(() => updateList());
    };

    /**
     * Clone this current model and add it to the list.
     * @param model model instance
     * @remarks It pushes new model to the first line of the list.
     */
    const duplicateModel = (model: TModel | BaseModel): TModel => {
      logger.trace("duplicate model", truncate(model.id));

      const modelState = model.save();
      modelState.id += "_duplicated";
      const modelCloned = addModel(modelState);
      modelCloned.custom = true;
      return modelCloned as TModel;
    };

    /**
     * Export model from the list.
     * @param model model instance
     */
    const exportModel = (model: TModel | BaseModel | TModelState): void => {
      logger.trace("export model:", truncate(model.id));

      // if (model.doc && withActivities) model.activities = model.activities.save();

      download(JSON.stringify(model), "model");
    };

    /**
     * Find model from the list.
     * @param modelId model ID
     * @returns model instance or undefined
     */
    const findModel = (modelId: string): TModel | undefined => {
      logger.trace("find model:", modelId);

      return state.models.find((model: UnwrapRef<TModel | BaseModel>) => model.id === modelId) as TModel;
    };

    /**
     * Get models by elementType.
     * @param elementType  neuron, recorder, stimulator, device
     * @returns models of the requested element type
     */
    const getModelsByElementType = (elementType: TElementType | "device"): UnwrapRef<(TModel | BaseModel)[]> => {
      logger.trace("get model by element type:", elementType);

      return state.models.filter((model: UnwrapRef<TModel | BaseModel>) => {
        if (elementType === "device") {
          return ["stimulator", "recorder"].includes(model.elementType);
        } else {
          return model.elementType === elementType;
        }
      });
    };

    /**
     * Get recent model ID.
     * @returns model ID
     */
    const getRecentModelId = (): string | undefined => (state.models.length > 0 ? state.models[0].id : undefined);

    /**
     * Check if model list has model.
     * @param modelId model ID
     * @returns boolean
     */
    const hasModel = (modelId: string): boolean => {
      return state.models.some((model: UnwrapRef<TModel | BaseModel>) => model.id === modelId);
    };

    /**
     * Import models the update list.
     * @param modelState model state
     */
    const importModels = (modelStates: TModelState[]): void => {
      logger.trace("import models");

      modelStates.forEach((modelState: TModelState) => {
        delete modelState._id;
        delete modelState._rev;
      });

      db.createModels(modelStates).then(() => updateList());
    };

    /**
     * Import multiple models from assets and add them to the database.
     */
    const importModelsFromAssets = async (): Promise<TModelState[]> => {
      logger.trace("import models from assets");

      let promises: Promise<TModelState>[] = [];
      if (props.modelAssets) {
        promises = props.modelAssets.map(async (file: string) => {
          return loadJSON(`assets/workspaces/${props.workspace}/models/${file}.json`).then((modelState: TModelState) =>
            db.create(modelState as IDoc),
          );
        });
      }
      return Promise.all(promises);
    };

    /**
     * Initialize model db.
     */
    const init = (): void => {
      logger.trace("init");

      db.count().then(async (count: number) => {
        logger.debug("models in DB:", count);
        if (count === 0 && state.tryImports > 0) {
          state.tryImports -= 1;
          return importModelsFromAssets().then(() => init());
        } else {
          return updateList();
        }
      });
    };

    /**
     * Create a new custom model instance.
     * @param modelState model state
     */
    const newModel = (modelState?: TModelState): TModel => {
      logger.trace("new model");

      const model = addModel(modelState);
      model.state.custom = true;
      return model as TModel;
    };

    /**
     * Reset database and then initialize.
     */
    const resetDatabase = (): void => {
      logger.trace("reset database");

      db.reset().then(() => init());
    };

    /**
     * Save model instance to the database.
     * @param model model instance
     */
    const saveModel = async (model: TModel | BaseModel): Promise<TModelState | void> => {
      logger.trace("save model:", truncate(model.id));

      return db.importModel(model).then(() => {
        // model.state.checkChanges();
        // updateList();
      });
    };

    /**
     * Update model list from the database.
     */
    const updateList = (): void => {
      logger.trace("update list");

      state.models = [];
      db.list("id", true).then((modelStates: TModelState[]) => {
        modelStates.forEach((modelState: TModelState) => addModel(modelState));

        setTimeout(() => {
          state.initialized = true;
        }, 500);
      });
    };

    /**
     * Validate model state.
     */
    const validateModel = (modelState: TModelState): boolean => {
      try {
        new props.Model(modelState);
        return true;
      } catch {
        return false;
      }
    };

    return {
      deleteModel,
      duplicateModel,
      exportModel,
      findModel,
      getModelsByElementType,
      getRecentModelId,
      hasModel,
      importModels,
      importModelsFromAssets,
      init,
      newModel,
      resetDatabase,
      saveModel,
      state,
      updateList,
      validateModel,
    };
  });
}

export const getNESTModelParameterStates = (modelId: string) => {
  const appStore = useAppStore();
  const model = appStore.currentWorkspace?.stores.modelDBStore.findModel(modelId);

  // default model params states
  const defaultParamStates: Record<string, IParamState> = {};
  if (model) {
    model.params.keys.forEach((modelParamKey: string) => {
      defaultParamStates[modelParamKey] = {
        id: modelParamKey,
        hidden: true,
        value: model.params.get(modelParamKey).value,
      };
    });
  }

  return defaultParamStates;
};
