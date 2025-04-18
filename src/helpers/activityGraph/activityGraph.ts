// activityGraph.ts

import { openLoading } from "@/stores/appStore";
import { TProject } from "@/types";

import { ActivityChartGraph } from "./activityChartGraph/activityChartGraph";
import { BaseObj } from "../common/base";
import { IActivityChartPanelProps } from "./activityChartGraph/activityChartPanel";

export interface IBaseActivityGraphProps {
  color: string;
  panels: IActivityChartPanelProps[];
}

export class BaseActivityGraph extends BaseObj {
  private _project: TProject;
  private _activityChartGraph: ActivityChartGraph;

  constructor(project: TProject, activityGraphProps?: IBaseActivityGraphProps) {
    super();

    this._project = project;
    this._activityChartGraph = new ActivityChartGraph(project, activityGraphProps);
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

    if (this._project.activities.state.hasSomeEvents) this.update();
  }

  /**
   * Serialize for JSON.
   * @return activity graph props
   */
  toJSON(): IBaseActivityGraphProps {
    return {
      color: this._activityChartGraph.state.traceColor,
      panels: this._activityChartGraph ? this._activityChartGraph.toJSON() : [],
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

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      activities: this.project.activities.hash,
      code: this.project.code.hash,
    });
  }
}
