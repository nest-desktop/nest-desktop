// modelDB.ts

import { DatabaseService } from "@/helpers/database";
import { Model } from "@nest/core/model/model";

export class ModelDB extends DatabaseService {
  constructor() {
    super("NEST_MODEL_STORE");
  }

  /**
   * Add a model to the database.
   */
  async addModel(data: any): Promise<any> {
    console.log("Add model: " + data.id);
    const model: Model = new Model(data);
    return this.create(model.toJSON());
  }

  /**
   * Add multiple models to database.
   */
  async addModels(data: any[]): Promise<any> {
    console.debug("Add models");
    const models: any[] = data.map(
      (model: any) =>
        new Promise<any>((resolve) => {
          this.addModel(model).then(() => {
            resolve(model);
          });
        })
    );
    return Promise.all(models);
  }

  /**
   * Delete a model in the database.
   */
  async deleteModel(modelId: string): Promise<any> {
    console.debug("Delete model: " + modelId);
    return this.delete(modelId);
  }

  /**
   * Import a model to the database.
   */
  async importModel(data: any): Promise<any> {
    console.debug("Import model: " + data.id);
    // return this.app.model.hasModel(data.id)
    //   ? this.updateModel(data)
    //   : this.addModel(data);
    // const promise: Promise<any> = this.hasModel(data.id)
    //   ? this.updateModel(new Model(this, data))
    //   : this.addModel(data);
    // return promise.then(() => this.updateModels());
  }

  /**
   * Update a model in the database.
   */
  async updateModel(data: any): Promise<any> {
    console.info("Update model: " + data.id);
    // const model: Model = this.app.model.getModel(data.id);
    // model.update(data);
    // return this.update(model);
  }
}
