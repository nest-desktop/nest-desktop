// inputAnalogSignalPlotModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { AnalogSignalPlotModel } from "./analogSignalPlotModel";

export class InputAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: IActivityChartPanelModelProps = {}
  ) {
    super(panel, modelProps);
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
    this.activities = this.panel.graph.project.activities.inputAnalogSignals;
  }
}
