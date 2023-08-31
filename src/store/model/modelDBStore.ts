// modelDBStore.ts

import { defineStore } from "pinia";
import { logger as mainLogger } from "@/utils/logger";

import { BaseModel } from "@/common/model/baseModel";
import { Model } from "@/types/modelTypes";
import { ModelDB } from "./modelDB";

const logger = mainLogger.getSubLogger({ name: "model DB store" });

const modelAssets: any[] = [];

export const useModelDBStore = defineStore("model-db", {
  state: () => ({
    db: new ModelDB(),
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
      return this.db.deleteModel(modelId).then(() => {
        this.updateList();
      });
    },
    /**
     * Get model from the model list.
     */
    getModel(modelId: string): Model {
      logger.trace("get model:", modelId);
      return (
        // @ts-ignore
        this.models.find((model: Model) => model.id === modelId) ||
        new BaseModel({ id: modelId, params: [] })
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
        const response = await fetch("assets/norse/models/" + file + ".json");
        const data = await response.json();
        promise = promise.then(() => this.db.addModel(data));
      });
      return promise;
    },
    /**
     * Initialize model db.
     */
    async init(): Promise<any> {
      logger.trace("init");
      return this.db.count().then(async (count: number) => {
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
      await this.db.reset().then(() => this.init());
    },
    /**
     * Save model object to the database.
     */
    async saveModel(model: Model): Promise<any> {
      return this.db.importModel(model);
    },
    /**
     * Update model list from the database.
     */
    async updateList(): Promise<any> {
      logger.trace("update list");
      this.models = [];
      return this.db.list("id").then((models: any[]) => {
        // this.models = models;
        models.forEach((model) => this.models.push(new BaseModel(model)));

        // if (this.projects.length === 0) {
        //   this._view.redirect();
        // }

        // Redirect if project id from the current route is provided in the list.
        // const currentRoute = this._app.vueSetupContext.root.$router.currentRoute;

        // if (currentRoute.name === 'projectId') {
        //   this.project =
        //     this.getProject(currentRoute.params.id) ||
        //     this.getProject(this.recentProjectId);
        //   this._view.redirect(this._view.state.projectId);
        // }
      });
    },
  },
});
