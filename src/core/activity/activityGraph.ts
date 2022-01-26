import { Activity } from './activity';
import { ActivityChartGraph } from './activityChart/activityChartGraph';
import { ActivityAnimationGraph } from './activityAnimation/activityAnimationGraph';
import { Project } from '../project/project';

export class ActivityGraph {
  private _activityAnimationGraph: ActivityAnimationGraph;
  private _activityChartGraph: ActivityChartGraph;
  private _codeHash: string;
  private _project: Project;

  constructor(project: Project, activityGraph: any = {}) {
    this._project = project;
    this.init(activityGraph);
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
  init(activityGraph: any = {}): void {
    // console.log('Init activity graph');
    this.initActivityChartGraph(activityGraph.panels || []);
    this.initActivityAnimationGraph();
  }

  /**
   * Update activity graph.
   */
  update(): void {
    // console.log('Update activity graph');
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
  initActivityChartGraph(panels: any[] = []): void {
    if (this._activityChartGraph == undefined) {
      this._activityChartGraph = new ActivityChartGraph(this._project, panels);
    } else {
      this._activityChartGraph.init(panels);
    }
  }

  /**
   * Empty activity graph.
   */
  emptyActivityGraph(): void {
    this._activityChartGraph.empty();
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

  /**
   * Serialize for JSON.
   * @return activity graph object
   */
  toJSON(): any {
    return this._activityChartGraph.toJSON();
  }
}
