import { ActivityChartPanelModel } from '../activityChartPanelModel';
import { ActivityChartPanel } from '../activityChartPanel';

export class SpikeTimesPanelModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel);
    this.activityType = 'spike';
    this.id = 'spikeTimesPanelModel';
    this.label = 'spike times';

    this.init(model);
  }

  /**
   * Initialize panel model.
   */
  override init(model: any = {}): void {
    this.initActivities();
  }

  /**
   * Initialize model for spike activities.
   */
  initActivities(): void {
    this.activities = this.panel.graph.project.spikeActivities;
  }
}
