// modelDB.ts

import { TModel, TModelProps } from "@/types";

import { DatabaseService, IDoc, IRes } from "../common/database";

export class BaseModelDB extends DatabaseService {
  constructor(name: string = "MODEL_STORE") {
    super(name);
  }

  /**
   * Create a model in the database.
   * @param model model object
   * @returns
   */
  async createModel(model: TModel): Promise<TModelProps | void> {
    this.logger.trace("create model", model.id);

    const data = model.toJSON();
    return this.create(data as IDoc).then((res: IRes) => {
      if (res.ok) {
        model.doc._id = res.id;
        model.doc._rev = res.rev;
      }
    });
  }

  /**
   * Create multiple models in the database.
   */
  async createModels(modelsProps: TModelProps[]): Promise<TModelProps[]> {
    this.logger.trace("add models");

    const models: Promise<TModelProps>[] = modelsProps.map(
      (modelProps: TModelProps) =>
        new Promise<TModelProps>((resolve) => {
          this.create(modelProps as IDoc).then(() => {
            resolve(modelProps);
          });
        })
    );
    return Promise.all(models);
  }

  /**
   * Delete a model in the database.
   * @param modelId model ID
   * @returns
   */

  async deleteModel(modelId: string): Promise<TModelProps> {
    this.logger.trace("delete model:", modelId);

    return this.delete(modelId);
  }

  /**
   * Delete multiple models.
   * @param models model objects
   * @returns
   */
  async deleteModels(models: (TModel | TModelProps)[]): Promise<IDoc[]> {
    this.logger.trace("delete models");

    const modelDocIds: string[] = models.map((model: TModel | TModelProps) => {
      const modelDocId: string = model.docId || model.id;
      return modelDocId;
    });
    return this.deleteBulk(modelDocIds);
  }

  /**
   * Import model object to the database.
   * @param model model object
   * @returns
   */
  async importModel(model: TModel): Promise<TModelProps | void> {
    this.logger.trace("import model:", model.id);

    return model.docId ? this.updateModel(model) : this.createModel(model);
  }

  /**
   * Update a model in the database.
   * @param model model object
   * @returns
   */
  async updateModel(model: TModel): Promise<TModelProps | void> {
    if (!model.docId) return;
    this.logger.trace("update model:", model.id);

    const data = model.toJSON();
    return this.update(model.docId, data as IDoc).then((res: IRes) => {
      if (res.ok) {
        model.doc._id = res.id;
        model.doc._rev = res.rev;
      }
    });
  }
}
