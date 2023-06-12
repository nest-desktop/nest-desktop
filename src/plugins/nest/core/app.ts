// app.ts

import { reactive, UnwrapRef } from 'vue';

import { Backend } from '@/helpers/backend';
import { Config } from '@/helpers/config';
import { ModelStore } from './model/modelStore';
import { Project } from './project/project';
import { ProjectStore } from './project/projectStore';

export class App extends Config {
  private _backends: any = {};
  private _model: ModelStore;
  private _project: ProjectStore;
  private _state: UnwrapRef<any>;

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
      version: process.env.APP_VERSION,
    });

    // Backends
    this._backends.nestSimulator = new Backend('NESTSimulator', {
      path: '/nest',
      port: 52425,
      versionPath: '/',
    });
    this._backends.insiteAccess = new Backend('InsiteAccess', {
      path: '/insite',
      port: 52056,
      versionPath: '/',
    });

    this._model = new ModelStore(this);
    this._project = new ProjectStore(this);
  }

  get backends(): any {
    return this._backends;
  }

  get currentProject(): Project {
    return this._project.project;
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
  init(config: any = {}): void {
    console.debug(this, 'Initialize app');
    this._state.ready = false;

    // Update configs from global config.
    this.updateConfigs(config);

    // Check if backends is running.
    this.checkBackends().then(() => {
      // Fetch models from NEST Simulator.
      this._model.fetchModelsNEST();

      // Fetch model files from Github.
      this._model.fetchModelFilesGithub();
    });

    if (
      this.config.intervalCheckBackends > 0 &&
      process.env.VUE_APP_INTERVAL_CHECK_BACKENDS != '0'
    ) {
      setInterval(() => {
        this.checkBackends();
      }, this.config.intervalCheckBackends * 1000);
    }

    let promise: Promise<void> = Promise.resolve();
    promise = promise.then(() => this._model.init());
    promise = promise.then(() => this._project.init());
    promise.then(() => (this._state.ready = true));
  }

  /**
   * Reset all databases.
   */
  resetDatabases(): void {
    console.debug(this, 'Reset all client-side databases');
    this._state.ready = false;
    let promise: Promise<void> = Promise.resolve();
    promise = promise.then(() => this._model.resetDatabase());
    promise = promise.then(() => this._project.resetDatabase());
    promise.then(() => (this._state.ready = true));
  }

  /**
   * Open dialog.
   */
  openDialog(source: string, action: string, data: any = {}): void {
    console.debug(this, 'Open dialog');
    this._state.dialog.source = source;
    this._state.dialog.action = action;
    this._state.dialog.data = data;
    this._state.dialog.open = true;
  }

  /**
   * Close dialog.
   */
  closeDialog(): void {
    console.debug(this, 'Close dialog');
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
    console.debug(this, 'Update backend config');
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
  checkBackends(): Promise<void> {
    return new Promise(resolve => {
      const nestSimulatorStatus = this._backends.nestSimulator.check();
      const insiteAccessStatus = this._backends.insiteAccess.check();
      Promise.all([nestSimulatorStatus, insiteAccessStatus]).then(values => {
        resolve();
      });
    });
  }
}
