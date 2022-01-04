import { ActivityChartPanelModel } from '../activityChartPanelModel';
import { ActivityChartPanel } from '../activityChartPanel';

export class SpikeTimesPanelModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel);
    this.id = 'spikeTimesPanelModel';
    this.label = 'spike times';
    this.activityType = 'spike';

    this.init(model);
  }

  /**
   * Initialize panel model.
   */
  override init(model: any = {}): void {
    // console.log('Initialize panel model.');
    this.initActivities();
  }

  /**
   * Initialize model for spike activities.
   */
  initActivities(): void {
    this.activities = this.panel.graph.project.spikeActivities;
  }
}
