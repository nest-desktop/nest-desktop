import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';

export class SpikeTimesPanel extends ActivityGraphPanel {
  constructor(graph: ActivityChartGraph, configName: string = null) {
    super(graph, configName);
    this.name = 'SpikeTimesPanel';
    this.label = 'parent panel of spike times';
    this.init();
  }

  /**
   * Initialize panels for spike activities.
   */
  init(): void {
    this.data = [];
    this.activities = this.graph.project.spikeActivities;
  }
}
