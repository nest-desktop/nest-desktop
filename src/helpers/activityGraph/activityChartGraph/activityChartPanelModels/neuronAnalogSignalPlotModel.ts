// neuronAnalogSignalPlotModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { AnalogSignalPlotModel } from "./analogSignalPlotModel";
import { IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { NodeActivities } from "@/helpers/nodeActivity/nodeActivities";

export class NeuronAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
    super(panel, modelProps);
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
