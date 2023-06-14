// inputAnalogSignalPlotModel.ts

import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPlotModel } from './analogSignalPlotModel';

export class InputAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'inputAnalogSignalPlot';
    this.label = 'input analog signals';
    this.panel.height = 10;
    this.panel.xaxis = 1;

    this.initActivities();
    this.init(model.records);
  }

  /**
   * Initialize plot panel for input signals.
   */
  override initActivities(): void {
    this.activities = this.panel.graph.project.activities.inputAnalogSignals;
  }
}
