import axios from 'axios';
import combineURLs from 'axios/lib/helpers/combineURLs';
import { reactive, UnwrapRef } from '@vue/composition-api';

import { consoleLog } from '../common/logger';

import { App } from '../app';
import { Model } from './model';
import { ModelDB } from './modelDB';
import { ModelView } from './modelView';

export class ModelStore {
  private _app: App;
  private _db: ModelDB;
  private _state: UnwrapRef<any>;
  private _view: ModelView;

  constructor(app: App) {
    this._app = app;
    this._db = new ModelDB(this._app);
    this._state = reactive({
      filesGithub: [],
      filterTags: ['installed'],
      models: [],
      modelsNEST: [],
      searchTerm: '',
    });
    this._view = new ModelView(this._app);
  }

  get model(): Model {
    return this._view.state.model;
  }

  set model(value: Model) {
    this._view.state.modelId = value.id;
    this._view.state.model = value;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get view(): ModelView {
    return this._view;
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 2);
  }

  /**
   * Initialize database for models.
   *
   * @Remarks
   * It imports models from assets when database is empty.
   */
  async init(): Promise<any> {
    this.consoleLog('Initialize model store');
    return this._db.count().then((count: number) => {
      if (count === 0) {
        return this._db
          .importModelsFromAssets()
          .then(() => this.initModelList());
      } else {
        return this.initModelList();
      }
    });
  }

  /**
   * Reset database and then update list.
   */
  async resetDatabase(): Promise<any> {
    this.consoleLog('Reset model database');
    await this._db.reset().then(() => this.init());
  }

  /**
   * Initialize model list.
   */
  async initModelList(): Promise<any> {
    this.consoleLog('Initialize model list');
    await this._db
      .list('id')
      .then(
        (models: any[]) =>
          (this._state.models = models.map(
            (model: any) => new Model(this._app, model)
          ))
      );
    // TODO: Refresh the view
  }

  /**
   * Filter models by element type.
   */
  filterModels(elementType: string = null): Model[] {
    if (elementType == null) {
      return this._state.models;
    }
    return this._state.models.filter(
      (model: Model) => model.elementType === elementType
    );
  }

  /**
   * Import models.
   */
  importModels(models: any[]): void {
    this.consoleLog('Import models');
    this._db.addModels(models).then(() => {
      this.initModelList();
    });
  }

  /**
   * Import model from GitHub.
   */
  async importModelFromGithub(modelId: string = ''): Promise<any> {
    this.consoleLog('Import model from GitHub');
    const url =
      'https://raw.githubusercontent.com/nest-desktop/nest-desktop-models/main/';
    const path: string = this._state.filesGithub.find((file: string) =>
      file.includes('/' + (modelId || this._state.modelId))
    );
    if (path == null) {
      return;
    }
    return axios.get(combineURLs(url, path)).then((response: any) => {
      if (response.status === 200) {
        const data = response.data;
        this._db.importModel(data).then(() => {
          this.initModelList().then(() => {
            if (modelId === this._view.state.modelId) {
              this._view.initModel(modelId);
            }
          });
        });
      }
    });
  }

  /**
   * Export models.
   */
  exportModels(models: Model[]): void {
    this.consoleLog('Export models');
    const modelsJSON: any[] = models.map((model: Model) => model.toJSON());
    this._app.download(
      JSON.stringify(modelsJSON),
      modelsJSON.length === 1 ? 'model' : 'models'
    );
  }

  /**
   * Delete models.
   * @param models List of model objects.
   */
  deleteModels(models: Model[]): void {
    this.consoleLog('Delete models');
    if (models.length === 0) return;
    const modelDocIds: string[] = models.map((model: Model) => model.doc._id);
    this._db.deleteBulk(modelDocIds).then(() => this.initModelList());
  }

  /**
   * Reset states of all model.
   */
  resetModelStates(): void {
    this._state.models.forEach((model: Model) => model.resetState());
  }

  /**
   * Fetch models from NEST Simulator.
   */
  fetchModelsNEST(): void {
    this._app.backends.nestSimulator.instance
      .get('api/Models')
      .then((response: any) => {
        this._state.modelsNEST = response.data;
      });
  }

  /**
   * Fetch model files hosted on GitHub.
   */
  fetchModelFilesGithub(): void {
    const url =
      'https://api.github.com/repos/nest-desktop/nest-desktop-models/git/trees/main?recursive=true';
    axios.get(url).then((response: any) => {
      this._state.filesGithub = response.data.tree
        .filter((tree: any) => tree.path.endsWith('.json'))
        .map((tree: any) => tree.path);
    });
  }

  /**
   * Check if file exists on GitHub.
   * @param model Model name
   */
  fileExistGithub(model: string): boolean {
    return this._state.filesGithub.some((file: string) => {
      const modelGroup = file.split('.json')[0].split('/')[1];
      return model.startsWith(modelGroup);
    });
  }

  /**
   * Get model from the model list.
   */
  getModel(modelId: string): Model {
    return (
      this._state.models.find((model: Model) => model.id === modelId) ||
      new Model(this._app, { id: modelId, params: [] })
    );
  }

  get recentModelId(): string {
    return this._state.models[0].id || undefined;
  }

  /**
   * Check if model list has model.
   */
  hasModel(modelId: string): boolean {
    return this._state.models.some((model: Model) => model.id === modelId);
  }

  /**
   * Save model object to the database.
   */
  async saveModel(model: Model): Promise<any> {
    return this._db.importModel(model);
  }

  /**
   * Delete model object from model list in app.
   */
  async deleteModel(modelId: string): Promise<any> {
    return this._db.deleteModel(modelId).then(() => {
      this.initModelList();
    });
  }

  /**
   * Clear search term.
   */
  clearSearch(): void {
    this._state.searchTerm = '';
  }
}
