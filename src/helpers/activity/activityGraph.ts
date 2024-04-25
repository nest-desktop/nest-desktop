// activityGraph.ts

import { ActivityChartGraph } from "../activityChartGraph/activityChartGraph";
import { IActivityChartPanelProps } from "../activityChartGraph/activityChartPanel";
import { BaseObj } from "../common/base";
import { TProject } from "@/types/projectTypes";

export interface IBaseActivityGraphProps {
  panels: IActivityChartPanelProps[];
}

export class BaseActivityGraph extends BaseObj {
  private _project: TProject;
  private _activityChartGraph: ActivityChartGraph;

  constructor(project: TProject, activityGraphProps?: IBaseActivityGraphProps) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._project = project;
    this._activityChartGraph = new ActivityChartGraph(
      project,
      activityGraphProps?.panels
    );
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
