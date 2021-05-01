import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';

export class SpikeSendersHistogramPanel extends SpikeTimesPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.name = 'SpikeSendersHistogramPanel';
    this.icon = 'mdi-chart-bar';
    this.label = 'histogram of spike senders';
    this.visible = false;
    this.xaxis = 4;
    this.init();
  }

  /**
   * Initialize histogram panel of spike senders.
   */
  init(): void {
    // console.log('Init histogram panel for spike times');
    this.activities = this.graph.project.spikeActivities;
    this.data = [];
  }

  /**
   * Update histogram panel of spike senders.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Init histogram panel of spike senders')
    this.activities.forEach((activity: SpikeActivity) => {
      this.updateSpikeSendersHistogram(activity);
    });
    this.layout.xaxis.title = 'Neuron ID';
    this.layout.yaxis.title = 'Spike count';
  }

  /**
   * Add empty data of spike senders histogram in plot data.
   */
  addSpikeSendersHistogram(activity: SpikeActivity): void {
    // console.log('Add histogram data of spike times')
    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      text: 'auto',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of spike senders in' + activity.recorder.view.label,
      hoverinfo: 'y',
      showlegend: false,
      opacity: 0.6,
      xbins: {
        start: 0,
        end: 1,
        size: 1,
      },
      marker: {
        color: 'black',
        line: {
          color: 'white',
          width: 0,
        },
      },
      x: [],
    });
  }

  /**
   * Update histogram of spike senders in plot data.
   */
  updateSpikeSendersHistogram(activity: SpikeActivity): void {
    // console.log('Update histogram data of spike times')
    if (!this.data.some((d: any) => d.activityIdx === activity.idx)) {
      this.addSpikeSendersHistogram(activity);
    }
    const data: any = this.data.find(
      (d: any) => d.activityIdx === activity.idx
    );
    const start: number = Math.min(activity.events.senders);
    const end: number = Math.max(activity.events.senders) + 1;
    data.x = activity.events.senders;
    data.xbins.start = start;
    data.xbins.end = end;
    data.marker.color = activity.recorder.view.color;
    // data.marker.line.width = (end - start) > 200 ? 0 : 1;
  }
}
