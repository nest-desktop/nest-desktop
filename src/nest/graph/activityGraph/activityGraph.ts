// activityGraph.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Activity } from "@nest/core/activity/activity";
import { ActivityChartGraph } from "./activityChartGraph";
import { ActivityAnimationGraph } from "./activityAnimationGraph";
import { Project } from "@nest/core/project/project";
import { ActivityChartPanelProps } from "./activityChart/activityChartPanel";

export interface ActivityGraphProps {
  panels?: ActivityChartPanelProps[];
}

interface ActivityGraphState {
  codeHash: string;
  dataHash: string;
}

export class ActivityGraph {
  private _activityAnimationGraph?: ActivityAnimationGraph;
  private _activityChartGraph?: ActivityChartGraph;
  private _project: Project;
  private _state: UnwrapRef<ActivityGraphState>;

  constructor(project: Project, activityGraph: ActivityGraphProps = {}) {
    this._project = project;
    this._state = reactive({
      codeHash: "",
      dataHash: "",
    });
    this.init(activityGraph);
  }

  get activityAnimationGraph(): ActivityAnimationGraph | undefined {
    return this._activityAnimationGraph;
  }

  get activityChartGraph(): ActivityChartGraph | undefined {
    return this._activityChartGraph;
  }

  get codeHash(): string {
    return this._state.codeHash;
  }

  get project(): Project {
    return this._project;
  }

  get state(): UnwrapRef<ActivityGraphState> {
    return this._state;
  }

  /**
   * Empty activity graph.
   */
  emptyActivityGraph(): void {
    if (this._activityChartGraph) {
      this._activityChartGraph.empty();
    }
  }

  /**
   * Initialize activity graph.
   */
  init(activityGraph: ActivityGraphProps = {}): void {
    this.initActivityChartGraph(activityGraph.panels);
    this.initActivityAnimationGraph();
    this.updateHash();
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
  initActivityChartGraph(panels: ActivityChartPanelProps[] = []): void {
    if (this._activityChartGraph == undefined) {
      this._activityChartGraph = new ActivityChartGraph(this._project, panels);
    } else {
      this._activityChartGraph.init(panels);
    }
  }

  /**
   * Serialize for JSON.
   * @return activity graph object
   */
  toJSON(): ActivityGraphProps {
    return {
      panels: this._activityChartGraph ? this._activityChartGraph.toJSON() : [],
    };
  }

  /**
   * Update activity graph.
   */
  update(): void {
    const activitiesHash = this._project.activities.all.map(
      (activity: Activity) => activity.hash
    );
    if (sha1({ activitiesHash }) === this._state.dataHash) return;

    if (this._activityChartGraph) {
      this._activityChartGraph.update();
    }
    if (this._activityAnimationGraph) {
      this._activityAnimationGraph.update();
    }
    this.updateHash();
  }

  /**
   * Update hash for activity graph.
   */
  updateHash(): void {
    this._state.codeHash = this._project.simulation.code.state.hash;
    const activitiesHash = this._project.activities.all.map(
      (activity: Activity) => activity.hash
    );
    this._state.dataHash = sha1({ activitiesHash });
  }
}
