import { Activity } from './activity';
import { ActivityChartGraph } from './activityChart/activityChartGraph';
import { ActivityAnimationGraph } from './activityAnimation/activityAnimationGraph';
import { Project } from '../project/project';

export class ActivityGraph {
  private _activityAnimationGraph: ActivityAnimationGraph;
  private _activityChartGraph: ActivityChartGraph;
  private _codeHash: string;
  private _project: Project;

  constructor(project: Project) {
    this._project = project;
    this.init();
  }

  get activityAnimationGraph(): ActivityAnimationGraph {
    return this._activityAnimationGraph;
  }

  get activityChartGraph(): ActivityChartGraph {
    return this._activityChartGraph;
  }

  get codeHash(): string {
    return this._codeHash;
  }

  get project(): Project {
    return this._project;
  }

  /**
   * Initialize activity graph.
   */
  init(): void {
    // console.log('Init activity graph');
    this.initActivityChartGraph();
    this.initActivityAnimationGraph();
  }

  /**
   * Update activity graph.
   */
  update(): void {
    // console.log('Update activity graph');
    this._activityChartGraph.updatePanelModels();
    this._activityChartGraph.update();
    this._activityAnimationGraph.update();
    this.updateHash();
  }

  /**
   * Update code hash for activity graph.
   */
  updateHash(): void {
    // console.log('Update code hash for activity graph');
    this._codeHash = this._project.code.hash;
  }

  /**
   * Initialize activity animation graph (Three).
   */
  initActivityAnimationGraph(): void {
    this._activityAnimationGraph = new ActivityAnimationGraph(this._project);
  }

  /**
   * Initialize activity chart graph (plotly).
   */
  initActivityChartGraph(): void {
    if (this._activityChartGraph == undefined) {
      this._activityChartGraph = new ActivityChartGraph(this._project);
    } else {
      this._activityChartGraph.init();
    }
  }

  /**
   * Empty activity graph.
   */
  emptyActivityGraph(): void {
    this._activityChartGraph.empty();
  }

  /**
   * Update color in activity graph.
   */
  updateColor(): void {
    this._activityChartGraph.updatePanelModelsColor();
  }

  /**
   * Check if it has any analog data.
   */
  hasAnyAnalogData(): boolean {
    return this._project.activities.some((activity: Activity) =>
      activity.hasAnalogData()
    );
  }

  /**
   * Check if it has any spike data.
   */
  hasAnySpikeData(): boolean {
    return this._project.activities.some((activity: Activity) =>
      activity.hasSpikeData()
    );
  }
}
