import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';
import { SpikeActivity } from '../spikeActivity';

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

  /**
   * Update panels for spike activities.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Update panels for spike activity.');
    this.data = [];
    this.activities.forEach((activity: SpikeActivity) => {
      this.updateData(activity);
    });

    this.updateLayoutLabel();
  }

  /**
   * Update marker color for spike activities.
   */
  updateColor(): void {
    this.activities.forEach((activity: SpikeActivity) => {
      const data: any = this.data.find(
        (d: any) => d.activityIdx === activity.idx
      );
      if (data !== undefined) {
        data.marker.color = activity.recorder.view.color;
      }
    });
  }
}
