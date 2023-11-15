import { reactive, UnwrapRef } from '@vue/composition-api';
import { sha1 } from 'object-hash';

import { Activity } from './activity';
import { ActivityChartGraph } from './activityChart/activityChartGraph';
import { ActivityAnimationGraph } from './activityAnimation/activityAnimationGraph';
import { Project } from '../project/project';

export class ActivityGraph {
  private _activityAnimationGraph: ActivityAnimationGraph;
  private _activityChartGraph: ActivityChartGraph;
  private _project: Project;
  private _state: UnwrapRef<any>;

  constructor(project: Project, activityGraph: any = {}) {
    this._project = project;
    this._state = reactive({
      codeHash: '',
      dataHash: '',
    });
    this.init(activityGraph);
  }

  get activityAnimationGraph(): ActivityAnimationGraph {
    return this._activityAnimationGraph;
  }

  get activityChartGraph(): ActivityChartGraph {
    return this._activityChartGraph;
  }

  get codeHash(): string {
    return this._state.codeHash;
  }

  get project(): Project {
    return this._project;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  /**
   * Initialize activity graph.
   */
  init(activityGraph: any = {}): void {
    this.initActivityChartGraph(activityGraph.panels || []);
    this.initActivityAnimationGraph();
    this.updateHash();
  }

  /**
   * Update activity graph.
   */
  update(): void {
    const activitiesHash = this._project.activities.map(
      (activity: Activity) => activity.hash
    );
    if (sha1({ activitiesHash }) === this._state.dataHash) return;

    this._activityChartGraph.update();
    this._activityAnimationGraph.update();
    this.updateHash();
  }

  /**
   * Update hash for activity graph.
   */
  updateHash(): void {
    this._state.codeHash = this._project.simulation.code.hash;
    const activitiesHash = this._project.activities.map(
      (activity: Activity) => activity.hash
    );
    this._state.dataHash = sha1({ activitiesHash });
  }

  /**
   * Initialize activity animation graph (Three).
   */
  initActivityAnimationGraph(): void {
    if (this._activityAnimationGraph == null) {
      this._activityAnimationGraph = new ActivityAnimationGraph(this._project);
    } else {
      this._activityAnimationGraph.init();
    }
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
   * Serialize for JSON.
   * @return activity graph object
   */
  toJSON(): any {
    return this._activityChartGraph.toJSON();
  }
}
