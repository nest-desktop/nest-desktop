// neuronAnalogSignalPlotModel.ts

import type { NodeActivities } from "@/helpers/nodeActivity/nodeActivities";

import { ActivityChartPanel } from "../activityChartPanel";
import { AnalogSignalPlotModel } from "./analogSignalPlotModel";
import type { IActivityChartPanelModelState } from "../activityChartPanelModel";

export class NeuronAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(panel: ActivityChartPanel, modelState: IActivityChartPanelModelState = {}) {
    super(panel, modelState);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "neuronAnalogSignalPlot";
    this.label = "neuron analog signals";
    this.panel.height = 20;
    this.panel.xAxis = 1;
  }

  /**
   * Update activities of neuron analog signals.
   */
  override updateActivities(): void {
    const activities = this.panel.graph.project.activities as NodeActivities;
    this.activities = activities.neuronAnalogSignals;
  }
}
