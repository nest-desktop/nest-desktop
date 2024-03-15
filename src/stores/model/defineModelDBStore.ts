// defineModelDBStore.ts

import { UnwrapRef } from "vue";
import { defineStore } from "pinia";

import { BaseModel, IModelProps } from "@/helpers/model/model";
import { BaseModelDB } from "@/helpers/model/modelDB";
import { TModel } from "@/types/modelTypes";
import { TModelDB } from "@/types/modelDBTypes";
import { getRuntimeConfig } from "@/utils/fetch";
import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

type Class<T> = new (...props: any) => T;

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
) {
  const logger = mainLogger.getSubLogger({
    minLevel: props.loggerMinLevel || 3,
    name: props.simulator + " model DB store",
  });

  const db = new props.ModelDB();

  return defineStore(props.simulator + "-model-db", {
    state: () => ({
      tryImports: 3,
      models: [] as TModel[],
    }),
    getters: {
      recentModelId: (state) =>
        // @ts-ignore
        state.models.length > 0 ? state.models[0].id : undefined,
    },
    actions: {
      /**
       * Delete model object from the database and then list model.
       */
      async deleteModel(modelId: string): Promise<void> {
        logger.trace("delete model:", modelId);
        return db.deleteModel(modelId).then(() => {
          this.updateList();
        });
      },
      /**
       * Find model from the list.
       */
      findModel(modelId: string): TModel | undefined {
        logger.trace("find model:", modelId);
        // @ts-ignore
        return this.models.find((model: TModel) => model.id === modelId);
      },
      /**
       * Get model from the model list.
       */
      getModel(modelId: string): TModel | undefined {
        logger.trace("get model:", modelId);
        return (
          // @ts-ignore
          this.findModel(modelId) ||
          new props.Model({ id: modelId, params: [] })
        );
      },
      /**
       * Get models by elementType.
       */
      getModelsByElementType(elementType: string): UnwrapRef<TModel[]> {
        logger.trace("get model by element type:", elementType);
        return this.models.filter((model: UnwrapRef<TModel>) => {
          if (elementType === "device") {
            return ["stimulator", "recorder"].includes(model.elementType);
          } else {
            return model.elementType === elementType;
          }
        });
      },
      /**
       * Check if model list has model.
       */
      hasModel(modelId: string): boolean {
        return this.models.some(
          (model: UnwrapRef<TModel>) => model.id === modelId
        );
      },
      /**
       * Import multiple models from assets and add them to the database.
       */
      async importModelsFromAssets(): Promise<IModelProps[]> {
        logger.trace("import models from assets");
        let promises: Promise<IModelProps>[] = [];
        if (props.modelAssets) {
          promises = props.modelAssets.map(async (file: string) => {
            return getRuntimeConfig(
              `assets/simulators/${props.simulator}/models/${file}.json`
            ).then((modelProps: IModelProps) => db.create(modelProps));
          });
        }
        return Promise.all(promises);
      },
      /**
       * Initialize model db.
       */
      async init(): Promise<void> {
        logger.trace("init");
        return db.count().then(async (count: number) => {
          logger.debug("models in DB:", count);
          if (count === 0 && this.tryImports > 0) {
            this.tryImports -= 1;
            return this.importModelsFromAssets().then(() => this.init());
          } else {
            return this.updateList();
          }
        });
      },
      /**
       * Reset database and then initialize.
       */
      async resetDatabase(): Promise<void> {
        logger.trace("reset database");
        await db.reset().then(() => this.init());
      },
      /**
       * Save model object to the database.
       */
      async saveModel(modelId: string): Promise<void> {
        logger.trace("save model:", truncate(modelId));
        const model = this.findModel(modelId);
        if (!model) return;
        return db.importModel(model);
      },
      /**
       * Update model list from the database.
       */
      async updateList(): Promise<void> {
        logger.debug("update list");
        this.models = [];
        return db.list("id").then((modelsProps: IModelProps[]) => {
          // this.models = models;
          modelsProps.forEach((modelProps: IModelProps) => {
            const model = new props.Model(modelProps) as TModel;
            this.models.push(model);
          });
        });
      },
    },
  });
}
