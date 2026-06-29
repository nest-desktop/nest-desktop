// inputAnalogSignalPlotModel.ts

import type { NodeActivities } from "@/activity";

import type { ActivityChartPanel } from "../activityChartPanel";
import { AnalogSignalPlotModel } from "./analogSignalPlotModel";
import type { IActivityChartPanelModelState } from "../activityChartPanelModel";

export class InputAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(panel: ActivityChartPanel, modelState: IActivityChartPanelModelState = {}) {
    super(panel, modelState);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "inputAnalogSignalPlot";
    this.label = "input analog signals";
    this.panel.height = 10;
    this.panel.xAxis = 1;
  }

  /**
   * Update activities of input analog signals.
   */
  override updateActivities(): void {
    const activities = this.panel.graph.project.activities as NodeActivities;
    this.activities = activities.inputAnalogSignals;
  }
}
