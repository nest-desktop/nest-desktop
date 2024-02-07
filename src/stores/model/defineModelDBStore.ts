// defineModelDBStore.ts

import { defineStore } from "pinia";

import { BaseModel } from "@/helpers/model/model";
import { BaseModelDB } from "@/helpers/model/modelDB";
import { Model } from "@/types/modelTypes";
import { ModelDB } from "@/types/modelDBTypes";
import { getRuntimeConfig } from "@/utils/fetch";
import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

type Class<T> = new (...args: any) => T;

export function defineModelDBStore(
  args: {
    Model: Class<Model>;
    ModelDB: Class<ModelDB>;
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
    name: args.simulator + " model DB store",
    minLevel: args.loggerMinLevel || 3,
  });

  const db = new args.ModelDB();

  return defineStore(args.simulator + "-model-db", {
    state: () => ({
      tryImports: 3,
      models: [] as Model[],
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
      async deleteModel(modelId: string): Promise<any> {
        logger.trace("gelete model:", modelId);
        return db.deleteModel(modelId).then(() => {
          this.updateList();
        });
      },
      /**
       * Find model from the list.
       */
      findModel(modelId: string): Model | undefined {
        logger.trace("find model:", truncate(modelId));
        // @ts-ignore
        return this.models.find((model: Model | any) => model.id === modelId);
      },
      /**
       * Get model from the model list.
       */
      getModel(modelId: string): Model | undefined {
        logger.trace("get model:", truncate(modelId));
        return (
          // @ts-ignore
          this.findModel(modelId) || new args.Model({ id: modelId, params: [] })
        );
      },
      /**
       * Get models by elementType
       */
      getModelsByElementType(elementType: string): Model[] {
        logger.trace("get model by element type:", elementType);
        return this.models.filter(
          // @ts-ignore
          (model: Model) => model.elementType === elementType
        );
      },
      /**
       * Check if model list has model.
       */
      hasModel(modelId: string): boolean {
        return this.models.some((model: any) => model.id === modelId);
      },
      /**
       * Import multiple models from assets and add them to the database.
       */
      async importModelsFromAssets(): Promise<any> {
        logger.trace("import models from assets");
        let promises = [];
        if (args.modelAssets) {
          promises = args.modelAssets.map(async (file: string) => {
            return getRuntimeConfig(
              `assets/simulators/${args.simulator}/models/${file}.json`
            ).then((data) => db.create(data));
          }) as any[];
        }
        return Promise.all(promises);
      },
      /**
       * Initialize model db.
       */
      async init(): Promise<any> {
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
      async resetDatabase(): Promise<any> {
        logger.trace("reset database");
        await db.reset().then(() => this.init());
      },
      /**
       * Save model object to the database.
       */
      async saveModel(modelId: string): Promise<any> {
        logger.trace("save model:", truncate(modelId));
        const model = this.findModel(modelId);
        if (!model) return;
        return db.importModel(model);
      },
      /**
       * Update model list from the database.
       */
      async updateList(): Promise<any> {
        logger.trace("update list");
        this.models = [];
        return db.list("id").then((models: any[]) => {
          // this.models = models;
          models.forEach((data) => {
            const model = new args.Model(data) as Model;
            this.models.push(model);
          });
        });
      },
    },
  });
}
