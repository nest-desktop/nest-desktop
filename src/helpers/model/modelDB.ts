// modelDB.ts

import type { TModel, TModelState } from "@/types";

import { DatabaseService, type IDoc, type IRes } from "../common";

export class BaseModelDB extends DatabaseService {
  constructor(name: string = "MODEL_STORE") {
    super(name);
  }

  /**
   * Create a model in the database.
   * @param model model instance
   * @returns Promise of model state
   */
  async createModel(model: TModel): Promise<TModelState | void> {
    this.logger.trace("create model", model.id);

    const data = model.save();
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
  async createModels(modelStates: TModelState[]): Promise<TModelState[]> {
    this.logger.trace("add models");

    const models: Promise<TModelState>[] = modelStates.map(
      (modelState: TModelState) =>
        new Promise<TModelState>((resolve) => {
          this.create(modelState as IDoc).then(() => resolve(modelState));
        }),
    );
    return Promise.all(models);
  }

  /**
   * Delete a model in the database.
   * @param model model instance
   * @returns Promise of model state
   */

  async deleteModel(model: TModel): Promise<TModelState> {
    this.logger.trace("delete model:", model.id);

    return this.delete(model.docId || model.id);
  }

  /**
   * Delete multiple models.
   * @param models model instances
   * @returns Promise of model docs
   */
  async deleteModels(models: (TModel | TModelState)[]): Promise<IDoc[]> {
    this.logger.trace("delete models");

    const modelDocIds: string[] = models.map((model: TModel | TModelState) => model.docId || model.id);
    return this.deleteBulk(modelDocIds);
  }

  /**
   * Import model to the database.
   * @param model model instance
   * @returns Promise of model state
   */
  async importModel(model: TModel): Promise<TModelState | void> {
    this.logger.trace("import model:", model.id);

    return model.docId ? this.updateModel(model) : this.createModel(model);
  }

  /**
   * Update a model in the database.
   * @param model model instance
   * @returns Promise of model state
   */
  async updateModel(model: TModel): Promise<TModelState | void> {
    if (!model.docId) return;
    this.logger.trace("update model:", model.id);

    const data = model.save();
    return this.update(model.docId, data as IDoc).then((res: IRes) => {
      if (res.ok) {
        model.doc._id = res.id;
        model.doc._rev = res.rev;
      }
    });
  }
}
