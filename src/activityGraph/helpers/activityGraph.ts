// activityGraph.ts

import { openLoading } from "@/app/appStore";
import type { TProject } from "@/types";
import { BaseObj, type IBaseState } from "@/core";

import { ActivityChartGraph } from "./activityChartGraph/activityChartGraph";
import { type IActivityChartPanelState } from "./activityChartGraph/activityChartPanel";

export interface IBaseActivityGraphState extends IBaseState {
  color: string;
  panels: IActivityChartPanelState[];
}

export class BaseActivityGraph extends BaseObj {
  private _project: TProject;
  private _activityChartGraph: ActivityChartGraph;

  constructor(project: TProject, activityGraphState?: IBaseActivityGraphState) {
    super();

    this._project = project;
    this._activityChartGraph = new ActivityChartGraph(project, activityGraphState);
  }

  get activityChartGraph(): ActivityChartGraph {
    return this._activityChartGraph;
  }

  override get hashObject(): IBaseState {
    return {
      activities: this.project.activities.hash,
    };
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

    if (this._project.activities.state.hasSomeEvents) this.update();
  }

  /**
   * Save activity graph to state
   * @return activity graph state
   */
  override save(): IBaseActivityGraphState {
    return {
      color: this._activityChartGraph.state.traceColor,
      panels: this._activityChartGraph ? this._activityChartGraph.save() : [],
    };
  }

  /**
   * Update activity graph.
   */
  update(): void {
    // if (this.project.activities.hash === this.dataHash) return;

    openLoading("Activity visualizing...");
    this._activityChartGraph.update();

    this.updateHash();
    this.logger.trace("update");
  }
}
