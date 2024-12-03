// activityGraph.ts

import { BaseActivityGraph, IBaseActivityGraphProps } from "@/helpers/activity/activityGraph";

import { ActivityAnimationGraph } from "../../helpers/activityAnimationGraph/activityAnimationGraph";
import { NESTProject } from "../project/project";

export class NESTActivityGraph extends BaseActivityGraph {
  private _activityAnimationGraph: ActivityAnimationGraph;

  constructor(project: NESTProject, activityGraphProps?: IBaseActivityGraphProps) {
    super(project, activityGraphProps);

    this._activityAnimationGraph = new ActivityAnimationGraph(project);
  }

  get activityAnimationGraph(): ActivityAnimationGraph {
    return this._activityAnimationGraph;
  }

  /**
   * Initialize activity graph.
   */
  override init(): void {
    this.updateHash();
    this.logger.trace("init");

    this.activityChartGraph.init();
    this.activityAnimationGraph.init();

    if (this.project.activities.state.hasSomeEvents) {
      this.update();
    }
  }

  /**
   * Update activity graph.
   */
  override update(): void {
    // if (this.project.activities.hash === this.dataHash) return;

    this.activityChartGraph.update();
    this.activityAnimationGraph.update();

    this.updateHash();
    this.logger.trace("update");
  }
}
