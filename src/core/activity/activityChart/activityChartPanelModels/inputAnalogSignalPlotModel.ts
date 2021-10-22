import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPlotModel } from './analogSignalPlotModel';

export class InputAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'InputAnalogSignalPlotPanel';
    this.label = 'input analog signals';
    this.panel.layout.yaxis.height = 1;
    this.init();
  }

  /**
   * Initialize plot panel for input signals.
   */
  init(): void {
    this.data = [];
    this.activities = this.panel.graph.project.inputAnalogSignalActivities;
  }
}
