import { reactive, UnwrapRef } from '@vue/composition-api';
import { SetupContext } from '@vue/composition-api';

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
  private _state: UnwrapRef<any>;
  private _vueSetupContext: SetupContext;

  constructor() {
    super('App');
    this._state = reactive({
      dialog: {
        action: '',
        data: {},
        open: false,
        source: '',
      },
      ready: false,
      theme: { dark: false },
      version: environment.VERSION,
    })

    // Backends
    this._backends.insiteAccess = new Backend('InsiteAccess', {
      path: '/insite',
      port: 8080,
      versionPath: '/version/',
    });
    this._backends.nestSimulator = new Backend('NESTSimulator', {
      path: '/nest',
      port: 5000,
      versionPath: '/',
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

  get darkMode(): boolean {
    return this.state.theme.dark;
  }

  set darkMode(value: boolean) {
    this.state.theme.dark = value;
    this.updateConfig({ darkMode: value });
    this._project.view.update();
    this._model.view.update();
    window.dispatchEvent(new Event('resize'));
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

  get vueSetupContext(): SetupContext {
    return this._vueSetupContext;
  }

  /**
   * Initialize application.
   */
  init(context: SetupContext, config: any): void {
    consoleLog(this, 'Initialize app');

    // Add setup context of Vue.
    this._vueSetupContext = context;

    // Update configs from global config.
    this.updateConfigs(config);

    // Check if backends is running.
    this.checkBackends();

    if (this.config.intervalCheckBackends > 0) {
      setInterval(() => {
        this.checkBackends();
      }, this.config.intervalCheckBackends * 1000);
    }

    // Fetch models from NEST Simulator.
    this._model.fetchModelsNEST();

    // Fetch model files from Github.
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
    consoleLog(this, 'Reset all client-side databases');
    this._state.ready = false;
    let promise: Promise<void> = Promise.resolve();
    promise = promise.then(() => this._model.resetDatabase());
    promise = promise.then(() => this._project.resetDatabase());
    promise.then(() => (this._state.ready = true));
  }

  /*
   * Download data.
   */
  download(
    data: string,
    filenameSuffix: string = '',
    format: string = 'json'
  ): void {
    consoleLog(this, 'Download data');
    const element: any = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/${format};charset=UTF-8,${encodeURIComponent(data)}`
    );
    element.setAttribute(
      'download',
      `nest-desktop-${filenameSuffix}-${this.datetime}.${format}`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Open dialog.
   */
  openDialog(source: string, action: string, data: any = {}): void {
    consoleLog(this, 'Open dialog');
    this._state.dialog.source = source;
    this._state.dialog.action = action;
    this._state.dialog.data = data;
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
   * Initialize theme.
   */
  initTheme(theme: any): void {
    this._state.theme = theme;
    this._state.theme.dark = this.config.darkMode;
  }

  /**
   * Update configs from global config.
   *
   * @remarks
   * Global config is loaded in main.ts.
   */
  updateConfigs(config: any = {}): void {
    consoleLog(this, 'Update backend config');
    if (config == null) return;

    if (config.nestSimulator && !this.backends.nestSimulator.config.custom) {
      this.backends.nestSimulator.updateURL(config.nestSimulator);
    }

    if (config.insiteAccess && !this.backends.insiteAccess.config.custom) {
      this.backends.insiteAccess.updateURL(config.insiteAccess);
    }
  }

  /**
   * Update configs from global config.
   *
   * @remarks
   * Global config is loaded in main.ts.
   */
  checkBackends(): void {
    this._backends.nestSimulator.check();
    this._backends.insiteAccess.check();
  }
}
