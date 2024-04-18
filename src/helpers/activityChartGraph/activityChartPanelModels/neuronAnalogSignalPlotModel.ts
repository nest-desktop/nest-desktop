// neuronAnalogSignalPlotModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import {
  AnalogSignalPlotModel,
  IAnalogSignalPlotModelProps,
} from "./analogSignalPlotModel";

export class NeuronAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: IAnalogSignalPlotModelProps = {}
  ) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "neuronAnalogSignalPlot";
    this.label = "neuron analog signals";
    this.panel.height = 20;
    this.panel.xAxis = 1;

    this.init(modelProps);
  }

  /**
   * Update activities of neuron analog signals.
   */
  override updateActivities(): void {
    this.activities = this.panel.graph.project.activities.neuronAnalogSignals;
  }
}
