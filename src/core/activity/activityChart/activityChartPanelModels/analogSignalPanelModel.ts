import { ActivityChartPanelModel } from '../activityChartPanelModel';
import { ActivityChartPanel } from '../activityChartPanel';
import { NodeRecord } from '../../../node/nodeRecord';

export class AnalogSignalPanelModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel);
    this.id = 'analogSignalPanelModel';
    this.label = 'analog signals';
    this.activityType = 'analog';

    this.init(model);
  }

  /**
   * Initialize panel model.
   *
   * @remarks
   * It sets activities and gets records from recorders.
   */
  override init(model: any = {}): void {
    // console.log('Initialize panel model.');
    this.initActivities();
    this.initAnalogRecords();
    this.initAnalogRecordsVisible(model.records);
  }

  /**
   * Initialize activity for the panel model.
   */
  initActivities(): void {
    this.activities = this.panel.graph.project.analogSignalActivities;
  }

  get axisTitle(): string {
    let title = '';
    const records = this.state.recordsVisible;
    const uniqueRecords = new Set(
      records.map((record: NodeRecord) => record.id)
    );
    if (uniqueRecords.size === 1) {
      const record = records[0];
      title = record.label;
      if (record.unit) {
        title += ` [${record.unit}]`;
      }
    } else if (records.every((event: any) => event.id.includes('ct_'))) {
      title = 'Channel activation';
    } else if (records.every((event: any) => event.id.includes('g_'))) {
      title = 'Conductance [nS]';
    } else if (records.every((event: any) => event.id.includes('I_syn_'))) {
      title = 'Total synaptic current [pA]';
    } else if (
      records.every((event: any) => event.id.includes('weighted_spikes_'))
    ) {
      title = 'Weighted incoming spikes';
    } else {
      title = 'Multiple records';
    }
    return title;
  }
}
