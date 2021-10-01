import { Activity } from './activity/activity';
import { AppView } from './appView';
import { Config } from './config';
import { DatabaseService } from './database';
import { Model } from './model/model';
import { NESTServer } from './backends/nest';
import { Project } from './project/project';

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
  private _models: Model[] = [];
  private _nestServer: NESTServer;
  private _project: Project;
  private _projectDB: DatabaseService;
  private _projectRevisions: Project[] = [];
  private _projects: Project[] = [];
  private _ready = false;
  private _version: string;
  private _view: AppView;

  constructor() {
    super('App');
    this._version = environment.VERSION;
    this._view = new AppView(this);
    this._nestServer = new NESTServer();
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

  get models(): Model[] {
    return this._models;
  }

  get modelDB(): DatabaseService {
    return this._modelDB;
  }

  get nestServer(): NESTServer {
    return this._nestServer;
  }

  get ready(): boolean {
    return this._ready;
  }

  get project(): Project {
    return this._project;
  }

  get projects(): Project[] {
    return this._projects;
  }

  set projects(values: Project[]) {
    this._projects = values;
  }

  get projectDB(): DatabaseService {
    return this._projectDB;
  }

  get projectRevisions(): Project[] {
    return this._projectRevisions;
  }

  get version(): string {
    return this._version;
  }

  get view(): AppView {
    return this._view;
  }

  init(): Promise<any> {
    this._project = new Project(this);
    this._ready = false;
    this._view.initProjectState();
    return this.initModels().then(() =>
      this.initProjects().then(() => (this._ready = true))
    );
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

  isDataReady(): boolean {
    return this._models.length > 0 && this._projects.length > 0;
  }

  resetDatabases(): void {
    this._ready = false;
    this.resetModelDatabase().then(() =>
      this.resetProjectDatabase().then(() => (this._ready = true))
    );
  }

  resetModelDatabase(): Promise<any> {
    this._models = [];
    return this._modelDB.destroy().then(() => this.initModels());
  }

  resetProjectDatabase(): Promise<any> {
    this._project = new Project(this);
    this._projects = [];
    return this._projectDB.destroy().then(() => this.initProjects());
  }

  /*
  Models
  */

  initModels(): Promise<any> {
    // console.log('Initialize models');
    this._models = [];
    this._modelDB = new DatabaseService(this, 'MODEL_STORE');
    return this._modelDB.count().then((count: number) => {
      // console.log('Models in db:', count);
      if (count === 0) {
        return this.loadModelsFromFiles().then(() => this.initModels());
      } else {
        return this.updateModels();
      }
    });
  }

  loadModelsFromFiles(): Promise<any> {
    // console.log('Load models from files');
    let promise: Promise<any> = Promise.resolve();
    this.config.models.forEach((file: string) => {
      console.log('Load model from file:', file);
      const data: any = require('../assets/models/' + file + '.json');
      promise = promise.then(() => this.addModel(data));
    });
    return promise;
  }

  filterModels(elementType: string = null): Model[] {
    if (elementType === null) {
      return this._models;
    }
    return this._models.filter(
      (model: Model) => model.elementType === elementType
    );
  }

  updateModels(): Promise<any> {
    return this._modelDB.list('id').then((models: any[]) =>
      models.forEach((model: any) => {
        this._models.push(new Model(this, model));
      })
    );
  }

  /*
  Model
  */

  addModel(data: any): Promise<any> {
    // console.log('Add model:', data.id);
    const model: Model = new Model(this, data);
    return this._modelDB.create(model);
  }

  deleteModel(docId: string): Promise<any> {
    return this._modelDB.delete(docId);
  }

  getModel(modelId: string): Model {
    return (
      this._models.find((model: Model) => model.id === modelId) ||
      new Model(this, { id: modelId, params: [] })
    );
  }

  hasModel(modelId: string): boolean {
    return (
      this._models.find((model: Model) => model.id === modelId) !== undefined
    );
  }

  saveModel(model: Model): Promise<any> {
    return this._modelDB.update(model);
  }

  initProjectFromAssets(filename: string): Project {
    const data: any = require(`../assets/projects/${filename}.json`);
    return new Project(this, data);
  }

  /*
  Projects
  */

  /**
   * Add projects to list and database.
   */
  addProjects(data: any[]): Promise<any> {
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
  deleteProjects(projectIds: string[]): Promise<any> {
    return this._projectDB.deleteBulk(projectIds).then(this.updateProjects());
  }

  /**
   * Initialize project list either from database or from files.
   */
  initProjects(): Promise<any> {
    // console.log('Initialize projects');
    this._projects = [];
    this._projectRevisions = [];
    this._projectDB = new DatabaseService(this, 'PROJECT_STORE');
    return this._projectDB.count().then((count: number) => {
      // console.log('Projects in db:', count);
      if (count > 0) {
        return this.updateProjects();
      } else {
        return this.loadProjectsFromFiles();
      }
    });
  }

  /**
   * Load projects from files and adds them to list and database.
   */
  loadProjectsFromFiles(): Promise<any> {
    // console.log('Load projects from files');
    let promise: Promise<any> = Promise.resolve();
    this.config.projects.forEach((file: string) => {
      // console.log('Load project from file:', file);
      const data: any = require('../assets/projects/' + file + '.json');
      promise = promise.then(() => this.addProject(data));
    });
    return promise;
  }

  /**
   * Load projects from database and then update list.
   */
  updateProjects(): Promise<any> {
    return this._projectDB.list('createdAt', true).then((projects: any[]) => {
      this._projects = projects.map(
        (project: any) => new Project(this, project)
      );
    });
  }

  /**
   * Load project revision from database and then update revision list.
   */
  updateProjectRevisions(id: string = null): Promise<any> {
    this._projectRevisions = [];
    if (id === null) {
      return;
    }
    return this._projectDB
      .revisions(id)
      .then((revIds: string[]) =>
        revIds.forEach((rev: string) =>
          this._projectDB
            .read(id, rev)
            .then((doc: any) =>
              this._projectRevisions.push(new Project(this, doc))
            )
        )
      );
  }

  /*
  Current project
  */
  getProject(projectId: string): Project {
    return (
      this._projects.find((project: Project) => project.id === projectId) ||
      new Project(this)
    );
  }

  /**
   * Add project to list and database.
   */
  addProject(data: any): Promise<any> {
    // console.log('Add project:', data.name);
    const project: Project = new Project(this, data);
    this._projects.unshift(project);
    return this._projectDB.create(project);
  }

  /**
   * Add project to list.
   */
  addProjectTemporary(data: any): Project {
    // console.log('Add project:', data.name);
    const project: Project = new Project(this, data);
    this._projects.unshift(project);
    return project;
  }

  /**
   * Delete project in database and remove it from the list.
   */
  deleteProject(projectId: string): Promise<any> {
    // console.log('Delete project:', projectId);
    return this._projectDB.delete(projectId).then(this.updateProjects());
  }

  /**
   * Download project from the list.
   */
  downloadProject(projectId: string, withActivities: boolean = false): void {
    // console.log('Download project:', projectId);
    const project: Project = this._projects.find(
      (p: Project) => p.id === projectId
    );
    const projectData: any = project.toJSON();
    if (withActivities) {
      projectData.activities = project.activities.map((activity: Activity) =>
        activity.toJSON()
      );
    }
    this.download(projectData, 'project');
  }

  /**
   * Initialize project or project revision from the list.
   */
  initProject(id: string = '', rev: string = ''): Promise<any> {
    // console.log(`Initialize project: id=${id}, rev=${rev}`);
    return new Promise<any>((resolve, reject) => {
      try {
        if (id && rev) {
          this._project = this._projectRevisions.find(
            (project: Project) => project.id === id && project.rev === rev
          );
        } else if (id) {
          this._project = this._projects.find(
            (project: Project) => project.id === id
          );
        } else {
          this.newProject();
        }
        resolve(true);
      } catch {
        console.log('Error in project initialization');
        this.newProject();
        reject(true);
      }
    });
  }

  /**
   * Create a new project and add it to the list but not to the database.
   */
  newProject(): void {
    this._project = new Project(this);
    this.updateProject(this._project);
  }

  /**
   * Reload the current project in the list from the database.
   */
  reloadProject(project: Project): Promise<any> {
    return this._projectDB.read(project.id).then((doc: any) => {
      this._project = new Project(this, doc);
      const idx: number = this._projects
        .map((p: Project) => p.id)
        .indexOf(project.id);
      this._projects[idx] = this._project;
    });
  }

  /**
   * Save the project in the database and then update the list.
   */
  saveProject(project: Project): Promise<any> {
    console.log('Save project:', project.name);
    project.clean();
    const promise: Promise<any> = project.id
      ? this._projectDB.update(project)
      : this._projectDB.create(project);
    return promise.then(() => this.updateProject(this._project));
  }

  /**
   * Remove project from the list.
   */
  unloadProject(project: Project): void {
    const idx: number = this._projects
      .map((p: Project) => p.id)
      .indexOf(project.id);
    if (idx !== -1) {
      this._projects = this._projects
        .slice(0, idx)
        .concat(this._projects.slice(idx + 1));
    }
  }

  /**
   * Add project to the top of the list.
   */
  updateProject(project: Project): void {
    this.unloadProject(project);
    this._projects.unshift(project);
  }

  /*
  General
  */

  download(data: any, filenameSuffix: string = '') {
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
}
