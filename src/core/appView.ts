import { reactive, UnwrapRef } from '@vue/composition-api';
import axios from 'axios';

import { Activity } from './activity/activity';
import { App } from './app';
import { Model } from './model/model';
import { Project } from './project/project';

export class AppView {
  private _app: App; // parent
  private _state: UnwrapRef<any>;

  constructor(app: App) {
    this._app = app;
    this._state = reactive({
      activity: {
        graphMode: 'chart',
      },
      dialog: {
        open: false,
        source: 'project',
        action: 'export',
        content: [],
      },
      model: {
        filesGithub: [],
        filterTags: ['installed'],
        modelId: '',
        modelsNEST: [],
        repoURL:
          'https://api.github.com/repos/nest-desktop/nest-desktop-models/git/trees/main?recursive=true',
        searchTerm: '',
      },
      models: [],
      project: {
        searchTerm: '',
      },
      projects: [],
    });
  }

  get app(): App {
    return this._app;
  }

  get activity(): any {
    return this._state.activity;
  }

  get filteredProjects(): Project[] {
    if (this._state.project.searchTerm === '') {
      return this._state.projects;
    } else {
      return this._state.projects.filter(
        (project: Project) =>
          project.name
            .toLowerCase()
            .indexOf(this._state.project.searchTerm.toLowerCase()) > -1
      );
    }
  }

  get model(): Model {
    return this._app.modelView.state.model;
  }

  set model(value: Model) {
    this._app.modelView.state.modelId = value.id;
    this._app.modelView.state.model = value;
  }

  get project(): Project {
    return this._app.modelView.state.project;
  }

  set project(value: Project) {
    this._app.projectView.state.projectId = value.id;
    this._app.projectView.state.project = value;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  async init(): Promise<void> {
    this.fetchModelsNEST();
    this.fetchModelFilesGithub();

    let promise: Promise<void> = Promise.resolve();
    promise = promise.then(() => this.updateModels());
    promise = promise.then(() => this.updateProjects());
    return promise;
  }

  isDataReady(): boolean {
    return this._state.models.length > 0 && this._state.projects.length > 0;
  }

  /**
   * Update model list.
   */
  async updateModels(): Promise<any> {
    return this._app.modelDB
      .list('id')
      .then(
        (models: any[]) =>
          (this._state.models = models.map(
            (model: any) => new Model(this._app, model)
          ))
      );
  }

  /**
   * Filter models by element type.
   */
  filterModels(elementType: string = null): Model[] {
    if (elementType === null) {
      return this._state.models;
    }
    return this._state.models.filter(
      (model: Model) => model.elementType === elementType
    );
  }

  /**
   * Export models.
   */
  exportModels(models: Model[]) {
    const modelsJSON: any[] = models.map((model: Model) => model.toJSON());
    this._app.download(
      modelsJSON,
      modelsJSON.length === 1 ? 'model' : 'models'
    );
  }

  /**
   * Delete models.
   */
  deleteModels(models: Model[]): void {
    const modelIds: string[] = models.map((model: Model) => model.id);
    this._app.deleteModels(modelIds).then(() => this.updateModels());
  }

  /**
   * Fetch files hosted on GitHub.
   */
  fetchModelsNEST(): void {
    // Fetch models from NEST Simulator.
    const url = `${this._app.NESTSimulator.url}/api/Models`;
    axios.get(url).then(resp => {
      this._state.model.modelsNEST = resp.data;
    });
  }

  /**
   * Fetch model files hosted on GitHub.
   */
  fetchModelFilesGithub(): void {
    axios.get(this._state.model.repoURL).then((response: any) => {
      this._state.model.filesGithub = response.data.tree
        .filter((tree: any) => tree.path.endsWith('.json'))
        .map((tree: any) => tree.path);
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

  /**
   * Check if model list has model.
   */
  hasModel(modelId: string): boolean {
    return (
      this._state.models.find((model: Model) => model.id === modelId) !==
      undefined
    );
  }

  /**
   * Update project list from the database.
   */
  async updateProjects(): Promise<any> {
    this._state.projects = [];
    this._state.projectRevisions = [];
    return this._app.projectDB
      .list('createdAt', true)
      .then((projects: any[]) => {
        this._state.projects = projects.map(
          (project: any) => new Project(this._app, project)
        );
      });
  }

  /**
   * Update revision list from the database.
   */
  async updateProjectRevisions(id: string = null): Promise<any> {
    this._state.projectRevisions = [];
    if (id === null) {
      return;
    }
    return this._app.projectDB
      .revisions(id)
      .then((revIds: string[]) =>
        revIds.forEach((rev: string) =>
          this._app.projectDB
            .read(id, rev)
            .then((doc: any) =>
              this._state.projectRevisions.push(new Project(this._app, doc))
            )
        )
      );
  }

  /**
   * Export projects.
   */
  exportProjects(projects: Project[]): void {
    const projectsJSON: any[] = projects.map((project: Project) => {
      const projectData: any = project.toJSON();
      if (project.state.withActivities) {
        projectData.activities = project.activities.map((activity: Activity) =>
          activity.toJSON()
        );
      }
      return projectData;
    });
    this._app.download(
      projectsJSON,
      projectsJSON.length === 1 ? 'project' : 'projects'
    );
  }

  /**
   * Delete projects.
   */
  deleteProjects(projects: Project[]): void {
    const projectIds: string[] = projects.map((project: Project) => project.id);
    this._app.deleteProjects(projectIds).then(() => this.updateProjects());
  }

  /*
  Current project
  */
  getProject(projectId: string): Project {
    return (
      this._state.projects.find(
        (project: Project) => project.id === projectId
      ) || new Project(this._app)
    );
  }

  /**
   * Add project to list.
   */
  addProjectTemporary(data: any): Project {
    // console.log('Add project:', data.name);
    const project: Project = new Project(this._app, data);
    this._state.projects.unshift(project);
    return project;
  }

  /**
   * Reload the current project in the list from the database.
   */
  async reloadProject(project: Project): Promise<any> {
    return this._app.projectDB.read(project.id).then((doc: any) => {
      this._state.project = new Project(this._app, doc);
      const idx: number = this._state.projects
        .map((p: Project) => p.id)
        .indexOf(project.id);
      this._state.projects[idx] = this._state.project;
    });
  }

  /**
   * Remove project from the list.
   */
  unloadProject(project: Project): void {
    const idx: number = this._state.projects
      .map((p: Project) => p.id)
      .indexOf(project.id);
    if (idx !== -1) {
      this._state.projects = this._state.projects
        .slice(0, idx)
        .concat(this._state.projects.slice(idx + 1));
    }
  }

  /**
   * Initialize project or project revision from the list.
   */
  initProject(id: string = '', rev: string = ''): Promise<any> {
    // console.log(`Initialize project: id=${id}, rev=${rev}`);
    return new Promise<any>((resolve, reject) => {
      try {
        if (id && rev) {
          this._app.projectView.state.project =
            this._state.projectRevisions.find(
              (project: Project) => project.id === id && project.rev === rev
            );
        } else if (id) {
          this._app.projectView.state.project = this._state.projects.find(
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
    this.project = new Project(this._app);
    this.updateProject(this.project);
  }

  /**
   * Add project to the top of the list.
   */
  updateProject(project: Project): void {
    this.unloadProject(project);
    this._state.projects.unshift(project);
  }

  /**
   * Export project from the list.
   */
  exportProject(projectId: string, withActivities: boolean = false): void {
    // console.log('Export project:', projectId);
    const project: Project = this._state.projects.find(
      (p: Project) => p.id === projectId
    );
    const projectData: any = project.toJSON();
    if (withActivities) {
      projectData.activities = project.activities.map((activity: Activity) =>
        activity.toJSON()
      );
    }
    this._app.download(projectData, 'project');
  }
}
