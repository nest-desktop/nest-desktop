import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPlotModel } from './analogSignalPlotModel';

export class InputAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'inputAnalogSignalPlot';
    this.label = 'input analog signals';
    this.panel.layout.yaxis.height = 1;
    this.initActivities();
  }

  /**
   * Initialize plot panel for input signals.
   */
  override initActivities(): void {
    this.activities = this.panel.graph.project.inputAnalogSignalActivities;
  }
}
