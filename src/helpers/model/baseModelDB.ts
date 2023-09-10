// modelDB.ts

import { BaseModel, ModelProps } from "@/helpers/model/baseModel";
import { DatabaseService } from "@/helpers/common/database";
import { Model } from "@/types/modelTypes";
import { logger as mainLogger } from "@/helpers/common/logger";

const logger = mainLogger.getSubLogger({
  name: "model DB",
  minLevel: 1,
});

export class BaseModelDB extends DatabaseService {
  constructor(name: string = "MODEL_STORE") {
    super(name);
  }

  /**
   * Create a model in the database.
   */
  async createModel(model: Model): Promise<Model> {
    logger.trace("create model", model.id);
    const data = model.toJSON();
    return this.create(data).then((res: any) => {
      if (res.ok) {
        model.doc._id = res.id;
        model.doc._rev = res.rev;
      }
    });
  }

  /**
   * Create multiple models in the database.
   */
  async addModels(data: ModelProps[]): Promise<ModelProps[]> {
    this.logger.trace("add models");
    const models: Promise<ModelProps>[] = data.map(
      (model: ModelProps) =>
        new Promise<ModelProps>((resolve) => {
          this.create(model).then(() => {
            resolve(model);
          });
        })
    );
    return Promise.all(models);
  }

  /**
   * Delete a model in the database.
   */
  async deleteModel(model: BaseModel | ModelProps | any): Promise<any> {
    this.logger.trace("delete model:", model.id);
    const modelDocId: string = model.docId || model._id;
    return this.delete(modelDocId);
  }

  /**
   * Delete multiple models.
   */
  async deleteModels(models: (Model | ModelProps)[]): Promise<any> {
    logger.trace("delete models");
    const modelDocIds: string[] = models.map(
      (
        model: Model | ModelProps | any // TODO: any should be removed.
      ) => model.docId || model.id
    );
    return this.deleteBulk(modelDocIds);
  }

  /**
   * Import model object to the database.
   */
  async importModel(model: Model): Promise<any> {
    console.log("import model:", model.id);
    return model.docId ? this.updateModel(model) : this.createModel(model);
  }

  /**
   * Update a model in the database.
   */
  async updateModel(model: Model): Promise<Model | undefined> {
    if (!model.docId) return;
    this.logger.trace("update model:", model.id);
    logger.trace("update model:", model.id);
    const data = model.toJSON();
    return this.update(model.docId, data).then((res: any) => {
      if (res.ok) {
        model.doc._id = res.id;
        model.doc._rev = res.rev;
      }
    });
  }
}
