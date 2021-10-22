import * as d3 from 'd3';

import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPlotModel } from './spikeTimesPlotModel';

export class SpikeSendersHistogramModel extends SpikeTimesPlotModel {
  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.id = 'SpikeSendersHistogram';
    this.icon = 'mdi-chart-bar';
    this.label = 'spike senders';
    this.panel.xaxis = 4;
    this.init();
  }

  /**
   * Update data for spike sender histogram.
   */
  updateData(activity: SpikeActivity): void {
    // console.log('Update data of spike time histogram.');
    const x: number[] = activity.events.senders;
    const start: number = d3.min(x);
    const end: number = d3.max(x) + 1;
    const size = 1;

    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of spike senders in' + activity.recorder.view.label,
      hoverinfo: 'y',
      showlegend: false,
      opacity: 0.6,
      xbins: {
        start,
        end,
        size,
      },
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: 'white',
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      x,
    });
  }

  /**
   * Update layout label for spike sender histogram.
   */
  updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Neuron ID';
    this.panel.layout.yaxis.title = 'Spike count';
  }
}
