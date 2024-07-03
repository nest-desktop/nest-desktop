// defineModelDBStore.ts

import { Store, _UnwrapAll, defineStore } from "pinia";
import { UnwrapRef, reactive } from "vue";

import { IDoc } from "@/helpers/common/database";
import { BaseModel } from "@/helpers/model/model";
import { BaseModelDB } from "@/helpers/model/modelDB";
import { TModel, TModelDB, TModelProps } from "@/types";
import { download } from "@/utils/download";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

interface IModelDBStoreState {
  initialized: boolean;
  models: TModel[];
  tryImports: number;
}

type Class<T> = new (...props: any) => T;

export type TModelDBStore = Store<string, any>;
// {
//   deleteModel: (model: TModel) => Promise<void>;
//   findModel: (modelId: string) => TModel | undefined;
//   getModelsByElementType: (elementType: string) => TModel[];
//   getModel: (modelId: string) => TModel | undefined;
//   getRecentModelId: () => string | undefined;
//   hasModel: (modelId: string) => boolean;
//   importModels: (modelsProps: TModelProps[]) => void;
//   importModelsFromAssets: () => Promise<TModelProps[]>;
//   init: () => void;
//   newModel: (modelProps: TModelProps) => TModel;
//   resetDatabase: () => void;
//   saveModel: (model: TModel) => Promise<TModelProps | void>;
//   state: IModelDBStoreState;
//   updateList: () => void;
//   validateModel: (modelProps: TModelProps) => boolean;
// }

export function defineModelDBStore(
  props: {
    Model: Class<TModel>;
    ModelDB: Class<TModelDB>;
    loggerMinLevel?: number;
    modelAssets?: string[];
    simulator: string;
  } = {
    Model: BaseModel,
    ModelDB: BaseModelDB,
    simulator: "base",
  }
): TModelDBStore {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 3,
    name: props.simulator + " model DB store",
  });

  const db = new props.ModelDB();
  // @ts-ignore - Cannot find namespace 'props'.
  type Model = props.Model;

  return defineStore(props.simulator + "-model-db", () => {
    const state = reactive<IModelDBStoreState>({
      initialized: false,
      models: [],
      tryImports: 3,
    });

    /**
     * Add model to the list.
     * @param model model object
     */
    const _addToList = (model: TModel): void => {
      state.models.unshift(model);
    };

    /**
     * Add this new model to the list.
     * @param modelProps model props
     *
     * @remarks
     * It pushes new model to the first line of the list.
     */
    const addModel = (modelProps?: TModelProps): Model => {
      logger.trace("add model:", modelProps?.id);

      const model = new props.Model(modelProps);
      _addToList(model);
      return model;
    };

    /**
     * Delete model object from the database and then list model.
     * @param model model object
     * @returns
     */
    const deleteModel = async (model: Model): Promise<void> => {
      logger.trace("delete model:", model.id);

      return db.deleteModel(model).then(() => updateList());
    };

    /**
     * Clone this current model and add it to the list.
     *
     * @remarks
     * It pushes new model to the first line of the list.
     */
    const duplicateModel = (model: Model): Model => {
      logger.trace("duplicate model", truncate(model.id));

      const modelDoc = model.doc ? model.toJSON() : model;
      modelDoc.id += "_duplicated";
      const modelCloned = addModel(modelDoc);
      modelCloned.custom = true;
      return modelCloned;
    };

    /**
     * Export model from the list.
     * @param modelId model ID
     */
    const exportModel = (
      model: Model | TModelProps,
      withActivities: boolean = false
    ): void => {
      logger.trace("export model:", truncate(model.id));

      if (model.doc && withActivities) {
        model.activities = model.activities.toJSON();
      }

      download(JSON.stringify(model), "model");
    };

    /**
     * Find model from the list.
     * @param modelId model ID
     * @returns model object or undefined
     */
    const findModel = (modelId: string): Model | undefined => {
      logger.trace("find model:", modelId);

      return state.models.find(
        (model: UnwrapRef<TModel>) => model.id === modelId
      ) as Model;
    };

    /**
     * Get models by elementType.
     * @param elementType element type
     */
    const getModelsByElementType = (
      elementType: string
    ): UnwrapRef<TModel[]> => {
      logger.trace("get model by element type:", elementType);

      return state.models.filter((model: UnwrapRef<TModel>) => {
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
    const getRecentModelId = (): string | undefined =>
      state.models.length > 0 ? state.models[0].id : undefined;

    /**
     * Check if model list has model.
     * @param modelId model ID
     */
    const hasModel = (modelId: string): boolean => {
      return state.models.some(
        (model: UnwrapRef<TModel>) => model.id === modelId
      );
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
          return loadJSON(
            `assets/simulators/${props.simulator}/models/${file}.json`
          ).then((modelProps: TModelProps) => db.create(modelProps as IDoc));
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
     * Add this new model to the list.
     * @param modelProps model props
     *
     * @remarks
     * It pushes new model to the first line of the list.
     */
    const newModel = (modelProps?: TModelProps): Model => {
      logger.trace("new model");

      const model = addModel(modelProps);
      model.custom = true;
      return model;
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
    const saveModel = async (model: Model): Promise<TModelProps | void> => {
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
