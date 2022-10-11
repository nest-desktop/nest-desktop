import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalTimeSeries } from './analogSignalTimeSeries';

export class InputAnalogSignalTimeSeries extends AnalogSignalTimeSeries {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.height = 10;
    this.panel.xaxis = 1;

    this.initActivities();
    this.init(model.records);
  }

  /**
   * Initialize plot panel for input analog signals.
   */
  override initActivities(): void {
    this.activities = this.panel.graph.project.inputAnalogSignalActivities;
  }
}
