import { reactive, UnwrapRef } from '@vue/composition-api';

import { consoleLog } from '../common/logger';

import { App } from '../app';
import { Config } from '../common/config';
import { Project } from './project';

export class ProjectView extends Config {
  private _app: App;
  private _state: UnwrapRef<any>;
  private _tools: any[] = [
    {
      icon: '$network',
      minWidth: 440,
      name: 'networkParamEdit',
      title: 'Network',
      width: 440,
    },
    {
      icon: 'mdi-engine-outline',
      minWidth: 440,
      name: 'simulationKernel',
      title: 'Kernel',
      width: 440,
    },
    {
      icon: 'mdi-code-braces',
      minWidth: 575,
      name: 'dataJSON',
      title: 'Data',
      devMode: true,
      width: 575,
    },
    {
      icon: 'mdi-xml',
      minWidth: 575,
      name: 'codeEditor',
      title: 'Code',
      width: 575,
    },
    {
      // icon: 'mdi-chart-scatter-plot',
      icon: 'mdi-tune-variant',
      minWidth: 440,
      name: 'activityEdit',
      title: 'Activity',
      width: 440,
    },
    {
      icon: 'mdi-table-large',
      minWidth: 510,
      name: 'activityStats',
      title: 'Stats',
      width: 510,
    },
  ];

  constructor(app: App) {
    super('ProjectView');
    this._app = app;

    // global state for project view.
    this._state = reactive({
      activityGraph: 'abstract',
      fromTime: 0,
      modeIdx: 0,
      networkGraphHeight: 'calc(100vh - 48px)',
      project: new Project(this._app),
      projectId: '',
      refreshIntervalId: undefined,
      tool: undefined,
      toolOpened: false,
      toast: {
        message: '',
        pauseOnHover: true,
        position: 'top-right',
        type: 'success',
      },
    });
  }

  get app(): App {
    return this._app;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get tools(): any[] {
    return this._tools;
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 3);
  }

  /**
   * Count networks before the current.
   */
  countBefore(): number {
    return this._state.project.networkRevisionIdx;
  }

  /**
   * Count networks after the current.
   */
  countAfter(): number {
    return (
      this._state.project.networkRevisions.length -
      this._state.project.networkRevisionIdx -
      1
    );
  }

  /**
   * Initialize project view
   */
  async init(): Promise<any> {
    this.consoleLog('Initialize project: ' + this._state.projectId);

    if (this._app.backends.insiteAccess.state.version.insite == null) {
      this.updateConfig({ simulateWithInsite: false });
    }

    return this._app.project.initProject(this._state.projectId).then(() => {
      if (this._state.project) {
        const generateCode =
          this.config.simulateWithInsite !==
          this._state.project.code.state.codeInsite;
        this._state.project.init({
          generateCode,
        });

        // update view mode for project.
        this.updateProjectMode();

        // update activity graph view.
        this._state.activityGraph = this._state.project.network.hasPositions()
          ? this._state.activityGraph
          : 'abstract';

        // run simulation if allowed.
        if (
          this.config.simulateAfterLoad &&
          this._state.modeIdx === 1 &&
          this._state.project.code.hash !==
            this._state.project.activityGraph.codeHash
        ) {
          this._state.project.runSimulation();
        }
      }
    });
  }

  /**
   * Set height for network graph.
   */
  resizeNetworkGraph(): void {
    this.consoleLog('Resize network graph');

    // caluclate height for network graph.
    this._state.networkGraphHeight =
      this._state.modeIdx === 2 ? 'calc(30vh)' : 'calc(100vh - 48px)';

    // call resize event.
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  /**
   * Select view for activity graph.
   */
  selectActivityGraph(mode: string): void {
    this.consoleLog('Select activity graph');

    this._state.activityGraph = mode;
    this._state.modeIdx = 1;
  }

  /**
   * Select tool for this project.
   */
  selectTool(tool: any): void {
    this.consoleLog('Select project tool');

    // open tool if closed or select other tool.
    this._state.toolOpened = this._state.toolOpened
      ? this._state.tool !== tool
      : true;
    // set project tool.
    this._state.tool = tool;
  }

  showActivityExplorer(): void {
    this._state.modeIdx = 1;
  }

  /**
   * Update view mode of the project.
   */
  updateProjectMode(): void {
    this.consoleLog('Update project view');

    // select tool and resize network graph if netwot editor or lab view is selected.
    if ([0, 2].includes(this._state.modeIdx)) {
      this._state.toolOpened = this._state.toolOpened
        ? this._state.modeIdx !== 2
        : this._state.toolOpened;
      this.resizeNetworkGraph();
    }

    // run simulation if allowed.
    if (
      this.config.simulateAfterLoad &&
      this._state.modeIdx === 1 &&
      this._state.project.code.hash !==
        this._state.project.activityGraph.codeHash
    ) {
      this._state.project.runSimulation();
    }
  }
}
