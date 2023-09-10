// nestModelDBStore.ts

import { defineStore } from "pinia";
import { logger as mainLogger } from "@/helpers/common/logger";

import { NESTModel } from "../../helpers/model/nestModel";
import { NESTModelDB } from "../../helpers/model/nestModelDB";

const logger = mainLogger.getSubLogger({ name: "model DB store" });

const modelAssets = [
  "voltmeter",
  "step_current_generator",
  "static_synapse",
  "spike_recorder",
  "spike_generator",
  "poisson_generator",
  "parrot_neuron",
  "noise_generator",
  "multimeter",
  "iaf_psc_alpha",
  "iaf_cond_alpha",
  "hh_psc_alpha",
  "dc_generator",
  "ac_generator",
];
const db = new NESTModelDB();

export const useNESTModelDBStore = defineStore("nest-model-db", {
  state: () => ({
    models: [] as NESTModel[],
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
    getModel(modelId: string): NESTModel {
      logger.trace("get model:", modelId);
      return (
        // @ts-ignore
        this.models.find((model: NESTModel) => model.id === modelId) ||
        new NESTModel({ id: modelId, params: [] })
      );
    },
    /**
     * Get models by elementType
     */
    getModelsByElementType(elementType: string): NESTModel[] {
      logger.trace("get model by element type:", elementType);
      return this.models.filter(
        // @ts-ignore
        (model: NESTModel) => model.elementType === elementType
      );
    },
    /**
     * Check if model list has model.
     */
    hasModel(modelId: string): boolean {
      return this.models.some((model: any) => model.id === modelId);
    },
    /**
     * Import model object to the database.
     */
    async importModel(model: NESTModel): Promise<any> {
      console.log("import model:", model.id.slice(0, 6));
      return model.docId ? db.updateModel(model) : db.createModel(model);
    },
    /**
     * Import multiple models from assets and add them to the database.
     */
    async importModelsFromAssets(): Promise<any> {
      logger.trace("import models from assets");
      let promise: Promise<any> = Promise.resolve();
      modelAssets.forEach(async (file: string) => {
        const response = await fetch("assets/nest/models/" + file + ".json");
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
      logger.trace("save model:", modelId.slice(0, 6));
      const model = this.models.find(
        (model) => model.id === modelId
      ) as NESTModel;

      return this.importModel(model);
    },
    /**
     * Update model list from the database.
     */
    async updateList(): Promise<any> {
      logger.trace("update list");
      this.models = [];
      return db.list("id").then((models: any[]) => {
        // this.models = models;
        models.forEach((model) => this.models.push(new NESTModel(model)));
      });
    },
  },
});
