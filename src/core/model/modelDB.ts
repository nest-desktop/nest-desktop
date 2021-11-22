import { consoleLog } from '../common/logger';

import { App } from '../app';
import { DatabaseService } from '../common/database';
import { Model } from './model';

export class ModelDB extends DatabaseService {
  constructor(app: App) {
    super(app, 'MODEL_STORE');
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 3);
  }

  /**
   * Add models to database.
   */
  async addModels(data: any[]): Promise<any> {
    this.consoleLog('Add models');
    const models: any[] = data.map(
      (model: any) =>
        new Promise<any>(resolve => {
          this.addModel(model).then(() => {
            resolve(model);
          });
        })
    );
    return Promise.all(models);
  }

  /**
   * Import models from assets.
   */
  async importModelsFromAssets(): Promise<any> {
    this.consoleLog('Import models from assets');
    let promise: Promise<any> = Promise.resolve();
    this.app.config.models.forEach((file: string) => {
      // this.consoleLog('Import model from assets: ' + file);
      const data: any = require('../../assets/models/' + file + '.json');
      promise = promise.then(() => this.addModel(data));
    });
    return promise;
  }

  /**
   * Delete models from database.
   */
  async deleteModels(modelIds: string[]): Promise<any> {
    return this.deleteBulk(modelIds).then(() => this.app.model.update());
  }

  /*
    Model
    */

  /**
   * Add a model to the database.
   */
  async addModel(data: any): Promise<any> {
    this.consoleLog('Add model: ' + data.id);
    const model: Model = new Model(this.app, data);
    return this.create(model);
  }

  /**
   * Delete a model in the database.
   */
  async deleteModel(modelId: string): Promise<any> {
    this.consoleLog('Delete model: ' + modelId);
    return this.delete(modelId);
  }

  /**
   * Import a model to the database.
   */
  async importModel(data: any): Promise<any> {
    this.consoleLog('Import model: ' + data.id);
    let promise: Promise<any>;
    if (this.app.model.hasModel(data.id)) {
      const model: Model = this.app.model.getModel(data.id);
      model.update(data);
      promise = this.updateModel(model);
    } else {
      promise = this.addModel(data);
    }
    return promise.then(() => this.app.model.update());
    // const promise: Promise<any> = this.hasModel(data.id)
    //   ? this.updateModel(new Model(this, data))
    //   : this.addModel(data);
    // return promise.then(() => this.updateModels());
  }

  /**
   * Update a model in the database.
   */
  async updateModel(data: any): Promise<any> {
    this.consoleLog('Update model: ' + data.id);
    return this.update(data);
  }
}
