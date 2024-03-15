// modelDB.ts

import { IModelProps } from "./model";
import { DatabaseService } from "../common/database";
import { TModel } from "@/types/modelTypes";

export class BaseModelDB extends DatabaseService {
  constructor(name: string = "MODEL_STORE") {
    super(name);
  }

  /**
   * Create a model in the database.
   */
  async createModel(model: TModel): Promise<TModel> {
    this.logger.trace("create model", model.id);
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
  async addModels(modelsProps: IModelProps[]): Promise<IModelProps[]> {
    this.logger.trace("add models");
    const models: Promise<IModelProps>[] = modelsProps.map(
      (modelProps: IModelProps) =>
        new Promise<IModelProps>((resolve) => {
          this.create(modelProps).then(() => {
            resolve(modelProps);
          });
        })
    );
    return Promise.all(models);
  }

  /**
   * Delete a model in the database.
   */
  async deleteModel(model: TModel | IModelProps | any): Promise<any> {
    this.logger.trace("delete model:", model.id);
    const modelDocId: string = model.docId || model._id;
    return this.delete(modelDocId);
  }

  /**
   * Delete multiple models.
   */
  async deleteModels(modelsProps: (TModel | IModelProps)[]): Promise<any> {
    this.logger.trace("delete models");
    const modelDocIds: string[] = modelsProps.map(
      (
        modelProps: TModel | IModelProps | any // TODO: any should be removed.
      ) => modelProps.docId || modelProps.id
    );
    return this.deleteBulk(modelDocIds);
  }

  /**
   * Import model object to the database.
   */
  async importModel(model: TModel): Promise<any> {
    this.logger.trace("import model:", model.id);
    return model.docId ? this.updateModel(model) : this.createModel(model);
  }

  /**
   * Update a model in the database.
   */
  async updateModel(model: TModel): Promise<TModel | undefined> {
    if (!model.docId) return;
    this.logger.trace("update model:", model.id);
    const data = model.toJSON();
    return this.update(model.docId, data).then((res: any) => {
      if (res.ok) {
        model.doc._id = res.id;
        model.doc._rev = res.rev;
      }
    });
  }
}
