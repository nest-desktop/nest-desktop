import * as d3 from 'd3';

import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class InterSpikeIntervalHistogramModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.xaxis = 2;
    this.params = [
      {
        id: 'binSize',
        input: 'tickSlider',
        label: 'bin size',
        ticks: [1, 2, 5, 10, 20, 50],
        unit: 'ms',
        value: 5,
      },
    ];
    this.state.xaxisType = 'linear';
  }

  /**
   * Update data for ISI histogram.
   */
  override async updateData(activity: SpikeActivity): Promise<any> {
    return new Promise((resolve, reject) => {
      if (activity.nodeIds.length === 0) reject(true);

      const isi: number[][] = activity.ISI();
      const x: number[] = [].concat.apply([], isi);
      const start: number = 0;
      const end: number = d3.max(x);
      const size: number = this.params[0].value;

      this.data.push({
        activityIdx: activity.idx,
        histfunc: 'count',
        hoverinfo: 'y',
        legendgroup: 'spikes' + activity.idx,
        marker: {
          color: activity.recorder.view.color,
          line: {
            color: activity.project.app.darkMode ? '#121212' : 'white',
            width: (end - start) / size > 100 ? 0 : 1,
          },
        },
        name: 'Histogram of ISI in' + activity.recorder.view.label,
        opacity: 0.6,
        showlegend: false,
        source: 'x',
        type: 'histogram',
        visible: this.state.visible,
        x,
        xbins: {
          end: end + 1,
          size,
          start,
        },
      });

      resolve(true);
    });
  }

  /**
   * Update layout label for ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Inter-spike interval [ms]';
    this.panel.layout.yaxis.title = 'Counts';
  }
}
