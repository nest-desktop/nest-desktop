// defineModelDBStore.ts

import { defineStore } from "pinia";
import { UnwrapRef, reactive } from "vue";

import { IDoc } from "@/helpers/common/database";
import { BaseModel, TElementType } from "@/helpers/model/model";
import { BaseModelDB } from "@/helpers/model/modelDB";
import { Class, TModelDB, TModelProps } from "@/types";
import { download } from "@/utils/download";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

interface IModelDBStoreState<TModel extends BaseModel = BaseModel> {
  initialized: boolean;
  models: TModel[];
  tryImports: number;
}

export function defineModelDBStore<TModel extends BaseModel = BaseModel>(
  props: {
    Model: Class<TModel | BaseModel>;
    ModelDB: Class<TModelDB>;
    loggerMinLevel?: number;
    modelAssets?: string[];
    workspace: string;
  } = {
    Model: BaseModel,
    ModelDB: BaseModelDB,
    workspace: "base",
  },
) {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 3,
    name: props.workspace + " model DB store",
  });

  const db = new props.ModelDB();

  return defineStore(props.workspace + "-model-db", () => {
    const state = reactive<IModelDBStoreState<TModel | BaseModel>>({
      initialized: false,
      models: [],
      tryImports: 3,
    });

    /**
     * Add model to the list.
     * @param model model object
     */
    const _addToList = (model: TModel | BaseModel): void => {
      state.models.unshift(model);
    };

    /**
     * Add this new model to the list.
     * @param modelProps model props
     * @remarks It pushes new model to the first line of the list.
     */
    const addModel = (modelProps?: TModelProps): TModel => {
      logger.trace("add model:", modelProps?.id);

      const model = new props.Model(modelProps) as TModel;
      _addToList(model);
      return model;
    };

    /**
     * Delete model object from the database and then list model.
     * @param model model object
     * @returns Promise from PouchDB
     */
    const deleteModel = async (model: TModel | BaseModel): Promise<void> => {
      logger.trace("delete model:", model.id);

      return db.deleteModel(model).then(() => updateList());
    };

    /**
     * Clone this current model and add it to the list.
     * @param model model object
     * @remarks It pushes new model to the first line of the list.
     */
    const duplicateModel = (model: TModel | BaseModel): TModel => {
      logger.trace("duplicate model", truncate(model.id));

      const modelDoc = model.toJSON();
      modelDoc.id += "_duplicated";
      const modelCloned = addModel(modelDoc);
      modelCloned.custom = true;
      return modelCloned as TModel;
    };

    /**
     * Export model from the list.
     * @param model model object
     */
    const exportModel = (model: TModel | BaseModel | TModelProps): void => {
      logger.trace("export model:", truncate(model.id));

      // if (model.doc && withActivities) model.activities = model.activities.toJSON();

      download(JSON.stringify(model), "model");
    };

    /**
     * Find model from the list.
     * @param modelId model ID
     * @returns model object or undefined
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
      // @ts-expect-error Type instantiation is excessively deep and possibly infinite.
      return state.models.some((model: UnwrapRef<TModel | BaseModel>) => model.id === modelId);
    };

    /**
     * Import models the update list.
     * @param modelProps model props
     */
    const importModels = (modelsProps: TModelProps[]): void => {
      logger.trace("import models");

      db.createModels(modelsProps).then(() => updateList());
    };

    /**
     * Import multiple models from assets and add them to the database.
     */
    const importModelsFromAssets = async (): Promise<TModelProps[]> => {
      logger.trace("import models from assets");

      let promises: Promise<TModelProps>[] = [];
      if (props.modelAssets) {
        promises = props.modelAssets.map(async (file: string) => {
          return loadJSON(`assets/workspaces/${props.workspace}/models/${file}.json`).then((modelProps: TModelProps) =>
            db.create(modelProps as IDoc),
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
     * Create a new custom model.
     * @param modelProps model props
     */
    const newModel = (modelProps?: TModelProps): TModel => {
      logger.trace("new model");

      const model = addModel(modelProps);
      model.custom = true;
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
     * Save model object to the database.
     * @param model model object
     */
    const saveModel = async (model: TModel | BaseModel): Promise<TModelProps | void> => {
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
      logger.debug("update list");

      state.models = [];
      db.list("id", true).then((modelsProps: TModelProps[]) => {
        modelsProps.forEach((modelProps: TModelProps) => addModel(modelProps));

        setTimeout(() => {
          state.initialized = true;
        }, 500);
      });
    };

    /**
     * Validate model props.
     */
    const validateModel = (modelProps: TModelProps): boolean => {
      try {
        new props.Model(modelProps);
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
