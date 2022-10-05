import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPlot } from './analogSignalPlot';

export class InputAnalogSignalPlot extends AnalogSignalPlot {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.height = 10;
    this.panel.xaxis = 1;

    this.initActivities();
    this.init(model.records);
  }

  /**
   * Initialize plot panel for input signals.
   */
  override initActivities(): void {
    this.activities = this.panel.graph.project.inputAnalogSignalActivities;
  }
}
