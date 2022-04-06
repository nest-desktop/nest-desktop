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
    this.consoleLog('Initialize project store');
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
    this.consoleLog('Initialize project list');
    this._state.projects = [];
    this._state.projectRevisions = [];
    await this._db.list('createdAt', true).then((projects: any[]) => {
      this._state.projects = projects;
      if (this._view.state.projectId != null) {
        this.project =
          this.getProject(this._view.state.projectId) || new Project(this._app);
      }
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
      JSON.stringify(projectsJSON),
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
   * Fetch a project from the list if if exists, otherwise a new project.
   * @param projectId ID of the project
   * @returns searched project resp. new project
   */
  getProject(projectId: string): Project {
    this.consoleLog('Get project');
    const projectIds = this._state.projects.map((project: any) => project.id);
    if (!projectIds.includes(projectId)) {
      return;
    }

    const projectIdx = projectIds.indexOf(projectId);
    let project = this._state.projects[projectIdx];
    if (project.doc == undefined) {
      project = new Project(this._app, project);
      project.init();
      this._state.projects[projectIdx] = project;
    }

    return project;
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
   * Initialize project or project revision from the list.
   */
  initProject(id: string = '', rev: string = ''): Promise<any> {
    this.consoleLog(`Initialize project: id=${id.slice(0, 6)}, rev=${rev}`);
    return new Promise<any>(resolve => {
      try {
        if (id && rev) {
          this.project = this._state.projectRevisions.find(
            (project: Project) => project.id === id && project.rev === rev
          );
        } else if (id) {
          this.project = this.getProject(id);
        } else {
          const name = 'Project ' + (this._state.projects.length + 1);
          this.createNewProject({ name });
        }
        resolve(true);
      } catch {
        this.consoleLog('Error in project initialization');
        resolve(false);
      }
    });
  }

  /**
   * Delete project in database and then update the list.
   */
  async deleteProject(project: Project): Promise<any> {
    this.consoleLog('Delete project');
    if (project.docId) {
      return this._db.delete(project.docId).finally(() => {
        this.removeFromList(project.id);
      });
    } else {
      this.removeFromList(project.id);
    }
  }

  /**
   * Create a new project and add it to the list but not to the database.
   */
  createNewProject(data: any = {}): void {
    this.consoleLog('Create new project');
    this.project = new Project(this._app, data);
    this.project.init();
    this.addToList(this.project);
  }

  /**
   * Reload the current project in the list from the database.
   */
  async reloadProject(project: Project): Promise<any> {
    this.consoleLog('Reload project');
    return this._db.read(project.id).then((doc: any) => {
      const idx: number = this._state.projects
        .map((p: Project) => p.id)
        .indexOf(project.id);

      const newProject = new Project(this._app, doc);
      this._state.projects[idx] = project;

      if (this._view.state.projectId === project.id) {
        this.project = newProject;
      }
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

    const promise: Promise<any> = project.docId
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
    this._app.download(JSON.stringify(projectData), 'project');
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
      // Remove project from the project list.
      this._state.projects.splice(idx, 1);
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
