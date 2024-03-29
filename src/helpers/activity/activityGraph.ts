// activityGraph.ts

import { ActivityAnimationGraph } from "../activityAnimationGraph/activityAnimationGraph";
import { ActivityChartGraph } from "../activityChartGraph/activityChartGraph";
import { IActivityChartPanelProps } from "../activityChartGraph/activityChartPanel";
import { BaseObj } from "../common/base";
import { TProject } from "@/types/projectTypes";

export class ActivityGraph extends BaseObj {
  private _project: TProject;
  private _activityChartGraph: ActivityChartGraph;
  private _activityAnimationGraph: ActivityAnimationGraph;

  constructor(
    project: TProject,
    activityGraph?: { panels: IActivityChartPanelProps[] }
  ) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._project = project;
    this._activityChartGraph = new ActivityChartGraph(
      project,
      activityGraph?.panels
    );
    this._activityAnimationGraph = new ActivityAnimationGraph(project);
  }

  get activityAnimationGraph(): ActivityAnimationGraph {
    return this._activityAnimationGraph;
  }

  get activityChartGraph(): ActivityChartGraph {
    return this._activityChartGraph;
  }

  get project(): TProject {
    return this._project;
  }

  /**
   * Initialize activity graph.
   */
  init(): void {
    this.updateHash();
    this.logger.trace("init");

    this._activityChartGraph.init();
    // this.activityAnimationGraph.init();

    if (this._project.activities.state.hasSomeEvents) {
      this.update();
    }
  }

  /**
   * Serialize for JSON.
   * @return activity graph object
   */
  toJSON(): { panels: IActivityChartPanelProps[] } {
    return {
      panels: this._activityChartGraph ? this._activityChartGraph.toJSON() : [],
    };
  }

  /**
   * Update activity graph.
   */
  update(): void {
    // if (this.project.activities.hash === this.dataHash) return;

    this._activityChartGraph.update();
    // this.activityAnimationGraph.update();

    this.updateHash();
    this.logger.trace("update");
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      activities: this.project.activities.hash,
      code: this.project.simulation.code.hash,
    });
  }
}
