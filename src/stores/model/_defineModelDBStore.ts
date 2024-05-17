// defineModelDBStore.ts

import { defineStore } from "pinia";
import { UnwrapRef, reactive } from "vue";

import { IDoc } from "@/helpers/common/database";
import { logger as mainLogger } from "@/helpers/common/logger";
import { BaseModel } from "@/helpers/model/model";
import { BaseModelDB } from "@/helpers/model/modelDB";
import { TModel, TModelDB, TModelProps } from "@/types";
import { getRuntimeConfig } from "@/utils/fetch";
import { truncate } from "@/utils/truncate";

type Class<T> = new (...props: any) => T;

export function defineModelDBStore<Model extends BaseModel>(
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
) {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 3,
    name: props.simulator + " model DB store",
  });

  const db = new props.ModelDB();

  return defineStore(props.simulator + "-model-db", () => {
    const state: UnwrapRef<{ tryImports: number; models: Model[] }> = reactive({
      tryImports: 3,
      models: [],
    });

    /**
     * Delete model object from the database and then list model.
     * @param modelId model ID
     * @returns
     */
    const deleteModel = async (modelId: string): Promise<void> => {
      logger.trace("delete model:", modelId);

      return db.deleteModel(modelId).then(() => updateList());
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
     * Get model from the model list.
     * @param modelId model ID
     */
    const getModel = (modelId: string): Model | undefined => {
      logger.trace("get model:", modelId);

      return findModel(modelId) || newModel({ id: modelId });
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
    const getRecentModelId = () =>
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
          return getRuntimeConfig(
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
     * Create new model object.
     * @param modelProps model props
     * @returns model object
     */
    const newModel = (modelProps: TModelProps): Model => {
      return new props.Model(modelProps) as Model;
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
     * @param modelId model ID
     */
    const saveModel = async (modelId: string): Promise<TModelProps | void> => {
      logger.trace("save model:", truncate(modelId));

      const model = findModel(modelId);
      if (!model) return;
      return db.importModel(model);
    };

    /**
     * Update model list from the database.
     */
    const updateList = (): void => {
      logger.debug("update list");

      state.models = [] as UnwrapRef<Model[]>;
      db.list("id").then((modelsProps: TModelProps[]) => {
        modelsProps.forEach((modelProps: TModelProps) => {
          const model = newModel(modelProps);
          // @ts-ignore Argument of type 'Model' is not assignable to parameter of type 'UnwrapRefSimple<Model>'.
          state.models.push(model);
        });
      });
    };

    /**
     * Validate model props.
     */
    const validateModel = (modelProps: TModelProps): boolean => {
      try {
        newModel(modelProps);
        return true;
      } catch {
        return false;
      }
    };

    return {
      deleteModel,
      findModel,
      getModel,
      getModelsByElementType,
      getRecentModelId,
      hasModel,
      importModels,
      importModelsFromAssets,
      init,
      resetDatabase,
      saveModel,
      state,
      updateList,
      validateModel,
    };
  });
}
