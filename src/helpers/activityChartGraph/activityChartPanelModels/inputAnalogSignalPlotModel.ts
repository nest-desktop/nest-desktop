// inputAnalogSignalPlotModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import {
  AnalogSignalPlotModel,
  IAnalogSignalPlotModelProps,
} from "./analogSignalPlotModel";

export class InputAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(
    panel: ActivityChartPanel,
    model: IAnalogSignalPlotModelProps = {}
  ) {
    super(panel, model);
    this.icon = "mdi-chart-bell-curve-cumulative";
    this.id = "inputAnalogSignalPlot";
    this.label = "input analog signals";
    this.panel.height = 10;
    this.panel.xAxis = 1;

    this.init(model.records);
  }

  /**
   * Update activities of input analog signals.
   */
  override updateActivities(): void {
    this.activities = this.panel.graph.project.activities.inputAnalogSignals;
  }
}
