import axios from 'axios';

import { AppView } from './appView';
import { Config } from './config';
import { DatabaseService } from './database';
import { Model } from './model/model';
import { ModelView } from './model/modelView';
import { NESTSimulator } from './backends/nestSimulator';
import { Project } from './project/project';
import { ProjectView } from './project/projectView';

import { environment } from '../environments/environment';

const pad = (num: number, size: number = 2): string => {
  let s: string = num + '';
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
};

export class App extends Config {
  private _modelDB: DatabaseService;
  private _modelView: ModelView;
  private _NESTSimulator: NESTSimulator;
  private _projectDB: DatabaseService;
  private _projectView: ProjectView;
  private _ready = false;
  private _version: string;
  private _view: AppView;

  constructor() {
    super('App');
    this._version = environment.VERSION;
    this._NESTSimulator = new NESTSimulator();

    // Initialize databases
    this._projectDB = new DatabaseService(this, 'PROJECT_STORE');
    this._modelDB = new DatabaseService(this, 'MODEL_STORE');

    // Initialize views
    this._view = new AppView(this);
    this._projectView = new ProjectView(this);
    this._modelView = new ModelView(this);
  }

  get datetime(): string {
    const now: Date = new Date();
    const date: any[] = [
      now.getFullYear() - 2000,
      pad(now.getMonth() + 1),
      pad(now.getDate()),
    ];
    const time: any[] = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ];
    const datetime: string = date.join('') + '_' + time.join('');
    return datetime;
  }

  get modelDB(): DatabaseService {
    return this._modelDB;
  }

  get modelView(): ModelView {
    return this._modelView;
  }

  get NESTSimulator(): NESTSimulator {
    return this._NESTSimulator;
  }

  get ready(): boolean {
    return this._ready;
  }

  get projectDB(): DatabaseService {
    return this._projectDB;
  }

  get projectView(): ProjectView {
    return this._projectView;
  }

  get version(): string {
    return this._version;
  }

  get view(): AppView {
    return this._view;
  }

  async init(): Promise<any> {
    this._ready = false;
    let promise: Promise<void> = Promise.resolve();
    promise = promise.then(() => this.initModels());
    promise = promise.then(() => this.initProjects());
    promise = promise.then(() => {
      this.view.init();
      this._ready = true;
    });
    return promise;
  }

  /*
  Database
  */

  isDatabaseReady(): boolean {
    return this._modelDB !== undefined && this._projectDB !== undefined;
  }

  isDatabaseValid(): boolean {
    if (!this.isDatabaseReady()) {
      return false;
    }
    return this._modelDB.isValid() && this._projectDB.isValid();
  }

  async resetDatabases(): Promise<void> {
    this._ready = false;
    let promise: Promise<void> = Promise.resolve();
    promise = promise.then(() => this.resetModelDatabase());
    promise = promise.then(() => this.resetProjectDatabase());
    promise = promise.then(() => {
      this.view.init();
      this._ready = true;
    });
    return promise;
  }

  async resetModelDatabase(): Promise<any> {
    return this._modelDB.destroy().then(() => {
      this._modelDB = new DatabaseService(this, 'MODEL_STORE');
      this.initModels();
    });
  }

  async resetProjectDatabase(): Promise<any> {
    return this._projectDB.destroy().then(() => {
      this._projectDB = new DatabaseService(this, 'PROJECT_STORE');
      this.initProjects();
    });
  }

  /*
  Models
  */

  /**
   * Initialize models.
   *
   * @Remarks
   * It imports models from assets when database is empty.
   */
  async initModels(): Promise<any> {
    // console.log('Initialize models');
    return this.modelDB.count().then((count: number) => {
      // console.log('Models in db:', count);
      if (count === 0) {
        return this.importModelsFromAssets().then(() => this.initModels());
      } else {
        return this._view.updateModels();
      }
    });
  }

  /**
   * Add models to list and database.
   */
  async addModels(data: any[]): Promise<any> {
    // console.log('Add models');
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
    // console.log('Load models from files');
    let promise: Promise<any> = Promise.resolve();
    this.config.models.forEach((file: string) => {
      console.log('Load model from file:', file);
      const data: any = require('../assets/models/' + file + '.json');
      promise = promise.then(() => this.addModel(data));
    });
    return promise;
  }

  /**
   * Delete models from database and then update the model list.
   */
  async deleteModels(modelIds: string[]): Promise<any> {
    return this._modelDB.deleteBulk(modelIds).then(this._view.updateModels());
  }

  /*
  Model
  */

  /**
   * Add a model to the database.
   */
  async addModel(data: any): Promise<any> {
    // console.log('Add model:', data.id);
    const model: Model = new Model(this, data);
    return this._modelDB.create(model);
  }

  /**
   * Delete a model in the database.
   */
  async deleteModel(docId: string): Promise<any> {
    return this._modelDB.delete(docId);
  }

  /**
   * Import a model to the database.
   */
  async importModel(data: any): Promise<any> {
    // console.log('Import model:', data.id);
    let promise: Promise<any>;
    if (this._view.hasModel(data.id)) {
      const model: Model = this._view.getModel(data.id);
      model.update(data);
      promise = this.updateModel(model);
    } else {
      promise = this.addModel(data);
    }
    return promise.then(() => this._view.updateModels());
    // const promise: Promise<any> = this.hasModel(data.id)
    //   ? this.updateModel(new Model(this, data))
    //   : this.addModel(data);
    // return promise.then(() => this.updateModels());
  }

  /**
   * Import model from GitHub.
   */
  async importModelFromGithub(modelId: string = ''): Promise<any> {
    const path: string = this._view.state.model.filesGithub.find(
      (file: string) =>
        file.includes('/' + (modelId || this.modelView.state.modelId))
    );
    if (path === undefined) {
      return;
    }
    const url =
      'https://raw.githubusercontent.com/nest-desktop/nest-desktop-models/main/';
    return axios.get(url + path).then((response: any) => {
      if (response.status === 200) {
        this.importModel(response.data).then(() => {
          if (response.data.id === this.modelView.state.modelId) {
            this.modelView.reloadModel();
          }
        });
      }
    });
  }

  /**
   * Update a model in the database.
   */
  async updateModel(data: any): Promise<any> {
    console.log('Update model:', data.id);
    return this._modelDB.update(data);
  }

  /*
  Projects
  */

  /**
   * Initialize project list either updating list from the database or importing from files.
   */
  async initProjects(): Promise<any> {
    // console.log('Initialize projects');
    return this.projectDB.count().then((count: number) => {
      // console.log('Projects in db:', count);
      if (count === 0) {
        return this.importProjectsFromAssets().then(() => this.initProjects());
      } else {
        return this._view.updateProjects();
      }
    });
  }

  /**
   * Add projects to the database.
   */
  async addProjects(data: any[]): Promise<any> {
    // console.log('Add projects');
    const projects: any[] = data.map(
      (project: any) =>
        new Promise<any>(resolve => {
          this.addProject(project).then(() => {
            resolve(project);
          });
        })
    );
    return Promise.all(projects);
  }

  /**
   * Delete projects from database and then update the list.
   */
  async deleteProjects(projectIds: string[]): Promise<any> {
    return this._projectDB
      .deleteBulk(projectIds)
      .then(this._view.updateProjects());
  }

  /**
   * Import projects from assets to the database.
   */
  async importProjectsFromAssets(): Promise<any> {
    // console.log('Load projects from files');
    let promise: Promise<any> = Promise.resolve();
    this.config.projects.forEach((file: string) => {
      // console.log('Load project from file:', file);
      const data: any = require('../assets/projects/' + file + '.json');
      promise = promise.then(() => this.addProject(data));
    });
    return promise;
  }

  /*
   * Project
   */

  /**
   * Add project to the database.
   */
  async addProject(data: any): Promise<any> {
    // console.log('Add project:', data.name);
    const project: Project = new Project(this, data);
    return this._projectDB.create(project);
  }

  /*
   * Import a project from the asset file.
   */
  loadProjectFromFile(filename: string): Project {
    const data: any = require(`../assets/projects/${filename}.json`);
    return new Project(this, data);
  }

  /**
   * Delete project in database and then update the list.
   */
  async deleteProject(projectId: string): Promise<any> {
    // console.log('Delete project:', projectId);
    return this._projectDB.delete(projectId).then(this._view.updateProjects());
  }

  /**
   * Import the project in the database and then update the list.
   */
  async importProject(project: Project): Promise<any> {
    console.log('Save project:', project.name);
    project.clean();
    const promise: Promise<any> = project.id
      ? this._projectDB.update(project)
      : this._projectDB.create(project);
    return promise.then(() => this._view.updateProject(project));
  }

  /*
  General
  */

  /*
   * Download data.
   */
  download(data: any, filenameSuffix: string = ''): void {
    const dataJSON: string = JSON.stringify(data);
    const element: any = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/json;charset=UTF-8,' + encodeURIComponent(dataJSON)
    );
    element.setAttribute(
      'download',
      `nest-desktop-${filenameSuffix}-${this.datetime}.json`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Update configs from global config.
   *
   * @remarks
   * Global config is loaded in main.ts.
   */
  updateConfigs(config: any = {}): void {
    // Update config for NEST Simulator
    if (config.NESTSimulator && !this.NESTSimulator.config.custom) {
      if ('url' in config.NESTSimulator) {
        this.NESTSimulator.url = config.NESTSimulator.url;
      } else {
        this.NESTSimulator.updateConfig(config.NESTSimulator);
      }
    }
  }
}
