// modelDBStore.ts

import { defineStore } from "pinia";
import { logger as mainLogger } from "@/helpers/common/logger";

import { Model } from "@/types/modelTypes";
import { BaseModel } from "@/helpers/model/model";
import { BaseModelDB } from "@/helpers/model/modelDB";
import { truncate } from "@/utils/truncate";

const logger = mainLogger.getSubLogger({ name: "model DB store" });

const modelAssets: string[] = [];
const db = new BaseModelDB();

export const useModelDBStore = defineStore("model-db", {
  state: () => ({
    models: [] as Model[],
  }),
  getters: {
    recentModelId: (state) =>
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
    getModel(modelId: string): Model {
      logger.trace("get model:", truncate(modelId));
      return (
        // @ts-ignore
        this.findModel(modelId) || new BaseModel({ id: modelId, params: [] })
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
      let promise: Promise<any> = Promise.resolve();
      modelAssets.forEach(async (file: string) => {
        const response = await fetch("assets/models/" + file + ".json");
        const data = await response.json();
        promise = promise.then(() => db.create(data));
      });
      return promise;
    },
    /**
     * Initialize model db.
     */
    async init(): Promise<any> {
      logger.trace("init");
      return db.count().then(async (count: number) => {
        logger.debug("models in DB:", count);
        if (count === 0) {
          return this.importModelsFromAssets().then(() => this.updateList());
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
      const model = this.findModel(modelId) as Model;
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
        models.forEach((model) => this.models.push(new BaseModel(model)));
      });
    },
  }
});
