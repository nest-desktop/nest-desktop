import { consoleLog } from './common/logger';

import { Backend } from './common/backend';
import { Config } from './common/config';
import { ModelStore } from './model/modelStore';
import { ProjectStore } from './project/projectStore';

import { environment } from '../environments/environment';

const pad = (num: number, size: number = 2): string => {
  let s: string = num + '';
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
};

export class App extends Config {
  private _backends: any = {};
  private _model: ModelStore;
  private _project: ProjectStore;
  private _state: any = {
    ready: false,
    version: '',
    dialog: {
      open: false,
      source: 'project',
      action: 'export',
      content: [],
    },
  };

  constructor() {
    super('App');
    this._state.version = environment.VERSION;

    // Backends
    this._backends.insiteAccess = new Backend('InsiteAccess', {
      path: '/insite',
      port: 8080,
      versionPath: '/version',
    });
    this._backends.nestSimulator = new Backend('NESTSimulator', {
      path: '/nest',
      port: 5000,
      versionPath: '',
    });

    this._model = new ModelStore(this);
    this._project = new ProjectStore(this);
  }

  get backends(): any {
    return this._backends;
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

  get model(): any {
    return this._model;
  }

  get project(): any {
    return this._project;
  }

  get state(): any {
    return this._state;
  }

  /**
   * Initialize application.
   */
  init(): void {
    consoleLog(this, 'Initialize app');
    this._model.fetchModelsNEST();
    this._model.fetchModelFilesGithub();

    this._state.ready = false;
    let promise: Promise<void> = Promise.resolve();
    promise = promise.then(() => this._model.init());
    promise = promise.then(() => this._project.init());
    promise.then(() => (this._state.ready = true));
  }

  /**
   * Reset all databases.
   */
  resetDatabases(): void {
    consoleLog(this, 'Reset all databases');
    this._state.ready = false;
    let promise: Promise<void> = Promise.resolve();
    promise = promise.then(() => this._model.resetDatabase());
    promise = promise.then(() => this._project.resetDatabase());
    promise.then(() => (this._state.ready = true));
  }

  /*
   * Download data.
   */
  download(data: any, filenameSuffix: string = ''): void {
    consoleLog(this, 'Download data');
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
   * Open dialog.
   */
  openDialog(source: string, action: string, content: any[]): void {
    consoleLog(this, 'Open dialog');
    this._state.dialog.source = source;
    this._state.dialog.action = action;
    this._state.dialog.content = content;
    this._state.dialog.open = true;
  }

  /**
   * Close dialog.
   */
  closeDialog(): void {
    consoleLog(this, 'Close dialog');
    this._state.dialog.open = false;
  }

  /**
   * Update configs from global config.
   *
   * @remarks
   * Global config is loaded in main.ts.
   */
  updateConfigs(config: any = {}): void {
    consoleLog(this, 'Update config from file');
    // Update config for NEST Simulator
    if (config.NESTSimulator && !this.backends.nestSimulator.config.custom) {
      if ('url' in config.NESTSimulator) {
        this.backends.nestSimulator.url = config.NESTSimulator.url;
      } else {
        this.backends.nestSimulator.updateConfig(config.NESTSimulator);
      }
    }
  }
}
