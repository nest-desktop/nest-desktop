import { reactive, UnwrapRef } from '@vue/composition-api';

import { App } from '../app';
import { Config } from '../config';
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
    this._state = reactive({
      activityGraph: 'abstract',
      fromTime: 0,
      modeIdx: 0,
      networkGraphHeight: 'calc(100vh - 48px)',
      project: new Project(app),
      projectId: '',
      refreshIntervalId: undefined,
      tool: undefined,
      toolOpened: false,
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
    // console.log('Load project: ' + id);
    return this._app.view.initProject(this._state.projectId).then(() => {
      if (this._state.project) {
        this._state.project.code.generate();
        this.updateProjectMode();
        this._state.project.network.state.reset();
        this._state.activityGraph = this._state.project.network.hasPositions()
          ? this._state.activityGraph
          : 'abstract';
        if (
          this.config.simulateAfterLoad &&
          this._state.modeIdx === 1 &&
          this._state.project.code.hash !==
            this._state.project.activityGraph.codeHash &&
          !this._state.project.config.simulateWithInsite
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
    this._state.networkGraphHeight =
      this._state.modeIdx === 2 ? 'calc(30vh)' : 'calc(100vh - 48px)';
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  /**
   * Select view for activity graph.
   */
  selectActivityGraph(mode: string): void {
    this._state.activityGraph = mode;
    this._state.modeIdx = 1;
  }

  /**
   * Select tool for this project.
   */
  selectTool(tool: any): void {
    this._state.toolOpened = this._state.toolOpened
      ? this._state.tool != tool
      : true;
    this._state.tool = tool;
  }

  showActivityExplorer(): void {
    this._state.modeIdx = 1;
  }

  /**
   * Update view mode of the project.
   */
  updateProjectMode(): void {
    if ([0, 2].includes(this._state.modeIdx)) {
      this._state.toolOpened = this._state.toolOpened
        ? this._state.modeIdx !== 2
        : this._state.toolOpened;
      this.resizeNetworkGraph();
    }
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
