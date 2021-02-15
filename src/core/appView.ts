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
      sidenavMode: 'list',
      sidenavOpened: true,
    };
    this._project = {
      searchTerm: '',
      mode: 'networkEditor',
      toolMode: {
        name: 'networkParamEdit',
      },
      toolOpened: false,
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

  setProjectMode(value: string) {
    this._project.mode = value;
    if (this._project.mode === 'labBook') {
      this._project.toolOpened = false;
    }
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
  }

  setProjectTool(mode: any): void {
    if (this._project.toolMode.name === mode.name) {
      this._project.toolOpened = !this._project.toolOpened;
    } else {
      this._project.toolMode = mode;
      this._project.toolOpened = true;
    }
  }
}
