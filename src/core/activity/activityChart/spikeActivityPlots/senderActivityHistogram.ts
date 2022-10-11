import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeActivityPanelModel } from '../spikeActivityPanelModel';

export class SenderActivityHistogram extends SpikeActivityPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.xaxis = 2;
    this.params = [
      {
        id: 'spikeRate',
        input: 'checkbox',
        label: 'Spikes per seconds (spikes/s)',
        value: false,
      },
      {
        id: 'histNorm',
        input: 'checkbox',
        label: 'Normed values',
        value: false,
      },
    ];
  }

  get histNormed(): boolean {
    return this.params[1].value;
  }

  get spikeRate(): boolean {
    return this.params[0].value;
  }

  /**
   * Add data of spike count in each sender for histogram panel.
   */
  override async addData(activity: SpikeActivity): Promise<boolean> {
    return new Promise(resolve => {
      const senders: number[] = activity.events.senders;

      const counts = {};
      for (const sender of senders) {
        counts[sender] = counts[sender] ? counts[sender] + 1 : 1;
      }

      const recordTime = activity.recordTime;
      const time = this.spikeRate ? (recordTime[1] - recordTime[0]) / 1000 : 1;

      // Calc spike rate if desired.
      const x: number[] = activity.nodeIds.map((nodeId: number) =>
        counts[nodeId] ? counts[nodeId] / time : 0
      );

      this.data.push({
        activityIdx: activity.idx,
        hoverinfo: 'y',
        legendgroup: 'spikes' + activity.idx,
        marker: {
          color: activity.recorder.view.color,
          line: {
            color: activity.project.app.darkMode ? '#121212' : 'white',
            width: 1,
          },
        },
        name:
          'Histogram of spikes in each sender in' +
          activity.recorder.view.label,
        opacity: 0.6,
        showlegend: false,
        type: 'histogram',
        visible: this.state.visible,
        histnorm: this.histNormed ? 'probability' : 'count',
        x,
      });

      resolve(true);
    });
  }

  /**
   * Update layout label for spike sender histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = this.spikeRate ? 'Spikes/s' : 'Spike count';
    this.panel.layout.yaxis.title = this.histNormed ? 'Normed' : 'Count';
  }
}
