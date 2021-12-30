import { ActivityChartPanelModel } from '../activityChartPanelModel';
import { ActivityChartPanel } from '../activityChartPanel';

export class SpikeTimesPlotModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.id = 'spikeTimesPlotModel';
    this.label = 'spike times';
    this.activityType = 'spike';
    this.initActivities();
  }

  /**
   * Initialize model for spike activities.
   */
  override initActivities(): void {
    this.activities = this.panel.graph.project.spikeActivities;
  }
}
