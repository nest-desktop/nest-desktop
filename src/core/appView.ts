import { App } from './app';
import { Project } from './project/project';

export class AppView {
  private _activity: any;
  private _app: App; // parent
  private _model: any;
  private _project: any;

  constructor(app: App) {
    this._activity = {
      graphMode: 'chart',
    };
    this._app = app;
    this._model = {
      selectedModel: '',
    };
    this._project = {
      searchTerm: '',
    };
  }

  get activity(): any {
    return this._activity;
  }

  get filteredProjects(): Project[] {
    if (this._project.searchTerm === '') {
      return this._app.projects;
    }
    return this._app.projects.filter(
      (project: Project) =>
        project.name
          .toLowerCase()
          .indexOf(this._project.searchTerm.toLowerCase()) > -1
    );
  }

  get project(): any {
    return this._project;
  }
}
