import { reactive, UnwrapRef } from '@vue/composition-api';

import { Activity } from '../activity/activity';
import { App } from '../app';
import { consoleLog } from '../common/logger';
import { Project } from './project';
import { ProjectDB } from './projectDB';
import { ProjectView } from './projectView';

export class ProjectStore {
  private _app: App;
  private _db: ProjectDB;
  private _state: UnwrapRef<any>;
  private _view: ProjectView;

  constructor(app: App) {
    this._app = app;
    this._db = new ProjectDB(this._app);
    this._state = reactive({
      searchTerm: '',
      projects: [],
      projectRevisions: [],
    });
    this._view = new ProjectView(this._app);
  }

  get filteredProjects(): Project[] {
    if (this._state.searchTerm === '') {
      return this._state.projects;
    } else {
      return this._state.projects.filter(
        (project: Project) =>
          project.name
            .toLowerCase()
            .indexOf(this._state.searchTerm.toLowerCase()) > -1
      );
    }
  }

  get project(): Project {
    return this._view.state.project;
  }

  set project(value: Project) {
    this._view.state.projectId = value.id;
    this._view.state.project = value;
  }

  get recentProjectId(): string {
    return this._state.projects[0].id || undefined;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get view(): ProjectView {
    return this._view;
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 2);
  }

  /**
   * Initialize project list either updating list from the database or importing from files.
   */
  async init(): Promise<any> {
    this.consoleLog('Initialize projects');
    return this._db.count().then((count: number) => {
      // this.consoleLog('Projects in db: '+ count);
      if (count === 0) {
        return this._db
          .importProjectsFromAssets()
          .then(() => this.initProjectList());
      } else {
        return this.initProjectList();
      }
    });
  }

  /**
   * Reset database and then update list.
   */
  async resetDatabase(): Promise<any> {
    this.consoleLog('Reset project database');
    await this._db.reset().then(() => this.init());
  }

  /**
   * Initialize project list from the database.
   */
  async initProjectList(): Promise<any> {
    this.consoleLog('Update project list');
    this._state.projects = [];
    this._state.projectRevisions = [];
    await this._db.list('createdAt', true).then((projects: any[]) => {
      this._state.projects = projects.map((data: any) => {
        const project = new Project(this._app, data);
        project.init();
        return project;
      });
    });
  }

  importProjects(projects: any[]): void {
    this.consoleLog('Import projects');
    this._db.addProjects(projects).then(() => this.initProjectList());
  }

  /**
   * Export projects.
   */
  exportProjects(projects: Project[]): void {
    this.consoleLog('Export projects');
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
   * Delete projects and then update the list.
   */
  async deleteProjects(projects: Project[]): Promise<any> {
    this.consoleLog('Delete projects');
    return this._db.deleteProjects(projects).then(() => this.initProjectList());
  }

  /**
   * Reset states of all projects.
   */
  resetProjectStates(): void {
    this.consoleLog('Reset states of projects');
    this._state.projects.forEach((project: Project) => project.resetState());
  }

  /**
   * Update revision list from the database.
   */
  async updateProjectRevisions(id: string = null): Promise<any> {
    this.consoleLog('Update project revisions');
    this._state.projectRevisions = [];
    if (id == null) {
      return;
    }
    return this._db
      .revisions(id)
      .then((revIds: string[]) =>
        revIds.forEach((rev: string) =>
          this._db
            .read(id, rev)
            .then((doc: any) =>
              this._state.projectRevisions.push(new Project(this._app, doc))
            )
        )
      );
  }

  /**
   * Get current project from the list.
   */
  getProject(projectId: string): Project {
    this.consoleLog('Get project');
    return (
      this._state.projects.find(
        (project: Project) => project.id === projectId
      ) || new Project(this._app)
    );
  }

  /*
   * Get a project from the asset file.
   */
  getProjectFromFile(filename: string): Project {
    this.consoleLog('Get project from file');
    const data: any = require(`../../assets/projects/${filename}.json`);
    return new Project(this._app, data);
  }

  /**
   * Add project to list.
   */
  addProjectTemporary(data: any): Project {
    this.consoleLog('Add temporary project: ' + data.name);
    const project: Project = new Project(this._app, data);
    this._state.projects.unshift(project);
    return project;
  }

  /**
   * Initialize project or project revision from the list.
   */
  initProject(id: string = '', rev: string = ''): Promise<any> {
    this.consoleLog(`Initialize project: id=${id}, rev=${rev}`);
    return new Promise<any>(resolve => {
      try {
        if (id && rev) {
          this.project = this._state.projectRevisions.find(
            (project: Project) => project.id === id && project.rev === rev
          );
        } else if (id) {
          this.project = this._state.projects.find(
            (project: Project) => project.id === id
          );
        } else {
          this.createProject();
        }
        resolve(true);
      } catch {
        this.consoleLog('Error in project initialization');
        this.createProject();
        resolve(true);
      }
    });
  }

  /**
   * Delete project in database and then update the list.
   */
  async deleteProject(projectId: string): Promise<any> {
    this.consoleLog('Delete project');
    return this._db.delete(projectId).then(() => {
      this.removeFromList(projectId);
    });
  }

  /**
   * Create a new project and add it to the list but not to the database.
   */
  createProject(): void {
    this.consoleLog('Create new project');
    this.project = new Project(this._app);
    this.project.init();
    this.addToList(this.project);
  }

  /**
   * Reload the current project in the list from the database.
   */
  async reloadProject(project: Project): Promise<any> {
    this.consoleLog('Reload project');
    return this._db.read(project.id).then((doc: any) => {
      this.project = new Project(this._app, doc);
      const idx: number = this._state.projects
        .map((p: Project) => p.id)
        .indexOf(project.id);
      this._state.projects[idx] = this.project;
    });
  }

  /**
   * Check if project list has project.
   */
  hasProject(projectId: string): boolean {
    this.consoleLog('has project');
    return this._state.projects.some(
      (project: Project) => project.id === projectId
    );
  }

  /**
   * Import the project in the database and then update the list.
   */
  async importProject(project: Project): Promise<any> {
    this.consoleLog('Import project: ' + project.name);
    project.clean();

    const promise: Promise<any> = project.doc._id
      ? this._db.update(project)
      : this._db.create(project);
    return promise.then(() => this.addToList(project));
  }

  /**
   * Export project from the list.
   */
  exportProject(projectId: string, withActivities: boolean = false): void {
    this.consoleLog('Export project: ' + projectId);
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

  /**
   * Remove project from the list.
   */
  removeFromList(projectId: string): void {
    this.consoleLog('Remove project from the list: ' + projectId);
    const idx: number = this._state.projects
      .map((p: Project) => p.id)
      .indexOf(projectId);
    if (idx !== -1) {
      this._state.projects = this._state.projects
        .slice(0, idx)
        .concat(this._state.projects.slice(idx + 1));
    }
  }

  /**
   * Add or move project to the top of the list.
   */
  addToList(project: Project): void {
    this.consoleLog('Add project to the list: ' + project.id);
    this.removeFromList(project.id);
    this._state.projects.unshift(project);
  }
}
