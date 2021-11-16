import { ActivityChartPanelModel } from '../activityChartPanelModel';
import { ActivityChartPanel } from '../activityChartPanel';

export class SpikeTimesPlotModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.id = 'SpikeTimesModel';
    this.label = 'spike times';
    this.activityType = 'spike';
    this.init();
  }

  /**
   * Initialize model for spike activities.
   */
  override init(): void {
    this.initState();

    this.data = [];
    this.activities = this.panel.graph.project.spikeActivities;
    this.state.records = this.activities.map(() => ['spike']);
  }
}
