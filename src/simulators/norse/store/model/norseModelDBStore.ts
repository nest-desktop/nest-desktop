// norseModelDBStore.ts

import { defineStore } from "pinia";
import { logger as mainLogger } from "@/helpers/common/logger";

import { NorseModel } from "../../helpers/model/norseModel";
import { NorseModelDB } from "../../helpers/model/norseModelDB";

const logger = mainLogger.getSubLogger({ name: "model DB store" });

const modelAssets = [
  "voltmeter",
  "step_current_generator",
  "static_synapse",
  "spike_recorder",
  "spike_generator",
  "poisson_generator",
  "noise_generator",
  "multimeter",
  "lif_neuron",
  "dc_generator",
  "ac_generator",
];
const db = new NorseModelDB();
export const useNorseModelDBStore = defineStore("norse-model-db", {
  state: () => ({
    models: [] as NorseModel[],
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
     * Get model from the model list.
     */
    getModel(modelId: string): NorseModel {
      logger.trace("get model:", modelId);
      return (
        // @ts-ignore
        this.models.find((model: NorseModel) => model.id === modelId) ||
        new NorseModel({ id: modelId, params: [] })
      );
    },
    /**
     * Get models by elementType
     */
    getModelsByElementType(elementType: string): NorseModel[] {
      logger.trace("get model by element type:", elementType);
      return this.models.filter(
        // @ts-ignore
        (model: NorseModel) => model.elementType === elementType
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
        const response = await fetch("assets/norse/models/" + file + ".json");
        const data = await response.json();
        promise = promise.then(() => db.createModel(data));
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
      logger.trace("save model", modelId.slice(0, 6));
      const model = this.models.find(
        (model) => model.id === modelId
      ) as NorseModel;

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
        models.forEach((model) => this.models.push(new NorseModel(model)));
      });
    },
  },
});
